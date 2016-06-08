import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Utils, StorageHelper} from '../helpers';
import {Repo} from './';

declare var Microsoft: any;

export interface IPinnable {
    isPinned?: boolean;
}

export interface IRepository extends IPinnable {
    id: number;
    name: string;
    description: string;
    full_name?: string;
    owner_login?: string;
    private?: boolean;
    html_url?: string;
}

export interface IBranch {
    id: number;
    name: string;
}

export interface IFile extends IPinnable {
    id: number
    name: string;
    path?: string;
    url?: string;
    content?: string;
    branch?: string;
    authorName?: string;
    authorEmail?: string;
}

export interface IToken {
    access_token: string;
    token_type: string;
    scope: string;
}

@Injectable()
export class GithubService {
    private _baseUrl: string = "";
    private _storage: StorageHelper<IToken>;
    private _currentUser;
    private _currentToken: IToken;

    constructor(private _http: Http) {
        this._storage = new StorageHelper<IToken>("GitHubTokens");
        this.switchProfile("@user");
    }

    repos(): Promise<Repo[]> {

        var headers = new Headers({
            "Accept": "application/json",
            "Authorization": "Bearer " + this._currentToken.access_token
        });

        var options = new RequestOptions({ headers: headers });

        let url = Utils.getMockFileUrl("json", "repository");
        return Utils.json<Repo[]>(this._http.get("https://api.github.com/orgs/officedev/repos", options));
    }

    files(): Promise<IFile[]> {
        let url = Utils.getMockFileUrl("json", "file");
        return Utils.json<IFile[]>(this._http.get(url));
    }

    branches(): Promise<IBranch[]> {
        let url = Utils.getMockFileUrl("json", "branch");
        return Utils.json<IBranch[]>(this._http.get(url));
    }

    file(name: string): Promise<string> {
        let url = Utils.getMockFileUrl("md", name);
        return Utils.text(this._http.get(url));
    }

    login(force?: boolean): Promise<IToken> {
        if (!Utils.isWord) return;

        return new Promise<IToken>((resolve, reject) => {
            var token = this._tryGetCachedToken("@user");
            if (force || Utils.isNull(token)) {
                var context = Office.context as any;
                context.ui.displayDialogAsync(window.location.protocol + "//" + window.location.host + "/authorize.html", { height: 35, width: 30 },
                    result => {
                        var dialog = result.value;
                        dialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, args => {
                            dialog.close();

                            if (Utils.isEmpty(args.message)) {
                                reject("No token received");
                            }
                            else {
                                try {
                                    if (args.message.indexOf('access_token') != -1) {
                                        this._currentToken = JSON.parse(args.message);
                                        this.loadProfile();

                                        resolve(this._currentToken);
                                    }
                                    else {
                                        reject(JSON.parse(args.message));
                                    }
                                }
                                catch (exception) {
                                    reject(exception);
                                }
                            }
                        });
                    });
            }
            else {
                this._currentToken = token;
                this.loadProfile();
                resolve(token);
            }

            return () => { console.info('Observable disposed'); }
        });
    }

    loadProfile() {
        var username = "@user";
        this._storage.add(username, this._currentToken);
    }

    switchProfile(username: string) {
        username = username || "@user";
        this._currentToken = this._storage.get(username);
        this.loadProfile();
    }

    logout(username: string) {
        username = username || "@user";
        this._storage.remove(username);
        this._currentToken = null;
    }

    private _tryGetCachedToken(username: string) {
        username = username || "@user";
        var token = this._storage.get(username);
        if (Utils.isEmpty(token)) return null;
        return token;
    }
}