import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Utils} from '../helpers/utilities';
import {StorageHelper} from '../helpers/storage.helper';

declare var Microsoft: any;

export interface IRepository {
    id: number;
    name: string;
    description: string;
    full_name?: string;
    owner_login?: string;
    private?: boolean;
    html_url?: string;
}

export interface IFile {
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
    private _currentToken;

    constructor(private _http: Http) {
        this._storage = new StorageHelper<IToken>("GitHubTokens");
    }

    repos(): Promise<IRepository[]> {
        let url = Utils.getMockFileUrl("json", "repository");
        return Utils.json<IRepository[]>(this._http.get(url));
    }

    files(): Promise<IFile[]> {
        let url = Utils.getMockFileUrl("json", "file");
        return Utils.json<IFile[]>(this._http.get(url));
    }

    file(name: string): Promise<string> {
        let url = Utils.getMockFileUrl("md", name);
        return Utils.text(this._http.get(url));
    }

    login(force?: boolean): Promise<IToken> {
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
                                    this._currentToken = JSON.parse(args.message);
                                    this.loadProfile();
                                    resolve(this._currentToken);
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