import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Utils, StorageHelper} from '../helpers';
import {IRepository, IBranch, IToken, IContents, IUserProfile} from './';

declare var Microsoft: any;

@Injectable()
export class GithubService {
    private _baseUrl: string = "";
    private _storage: StorageHelper<IToken>;
    private _currentUser: IUserProfile;
    private _currentToken: IToken;
    private _username = "@user";

    constructor(private _http: Http) {
        this._storage = new StorageHelper<IToken>("GitHubTokens");
        this.loadProfile();
    }

    repos(): Promise<IRepository[]> {

        var headers = new Headers({
            "Accept": "application/json",
            "Authorization": "Bearer " + this._currentToken.access_token
        });

        var options = new RequestOptions({ headers: headers });

        let url = Utils.getMockFileUrl("json", "repository");
        return Utils.json<IRepository[]>(this._http.get("https://api.github.com/orgs/officedev/repos", options));
    }

    files(): Promise<IContents[]> {
        let url = Utils.getMockFileUrl("json", "file");
        return Utils.json<IContents[]>(this._http.get(url));
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
            var token = this._tryGetCachedToken();
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
        });
    }

    loadProfile() {
        if (this._currentToken) {
            this._storage.add(this._username, this._currentToken);
        }
        else {
            this._currentToken = this._storage.get(this._username);
        }
    }

    private _tryGetCachedToken() {
        var token = this._storage.get(this._username);
        if (Utils.isEmpty(token)) return null;
        return token;
    }
}