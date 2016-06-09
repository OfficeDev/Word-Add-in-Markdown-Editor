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
        this._tryGetCachedToken();
    }

    repos(orgName: string): Promise<IRepository[]> {

        var headers = new Headers({
            "Accept": "application/json",
            "Authorization": "Bearer " + this._currentToken.access_token
        });

        var options = new RequestOptions({ headers: headers });

        let url = Utils.getMockFileUrl("json", "repository");
        return Utils.json<IRepository[]>(this._http.get("https://api.github.com/orgs/" + orgName + "/repos", options));
    }

    files(orgName: string, repoName: string, branchName: string): Promise<IContents[]> {

        var headers = new Headers({
            "Accept": "application/json",
            "Authorization": "Bearer " + this._currentToken.access_token
        });

        var options = new RequestOptions({ headers: headers });
        let url = Utils.getMockFileUrl("json", "file");
        return Utils.json<IContents[]>(this._http.get("https://api.github.com/repos/OfficeDev" + "/" + repoName + "/contents?ref=" + branchName, options));
    }

    branches(orgName: string, repoName: string): Promise<IBranch[]> {

        var headers = new Headers({
            "Accept": "application/json",
            "Authorization": "Bearer " + this._currentToken.access_token
        });

        var options = new RequestOptions({ headers: headers });
        let url = Utils.getMockFileUrl("json", "branch");
        return Utils.json<IBranch[]>(this._http.get("https://api.github.com/repos/" + orgName + "/" + repoName + "/branches", options));

    }

    file(orgName: string, repoName: string, branchName: string, filePath: string): Promise<string> {
        //var headers = new Headers({
        //    "Accept": "application/json",
        //    "Authorization": "Bearer " + this._currentToken.access_token
        //});

        //var options = new RequestOptions({ headers: headers });
        //let url = Utils.getMockFileUrl("md", "name");
        return Utils.text(this._http.get("https://raw.githubusercontent.com/" + orgName + "/" + repoName + "/" + branchName + "/" + filePath));
    }

    login(force?: boolean): Promise<IToken> {
        if (!Utils.isWord) return;

        return new Promise<IToken>((resolve, reject) => {
            var token = this._tryGetCachedToken();
            if (!(force || Utils.isNull(token))) {
                resolve(token);
                return;
            }

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
                                    this._storage.add(this._username, JSON.parse(args.message));
                                    this._tryGetCachedToken();
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
        });
    }

    loadProfile() {
        // get user profile here
    }

    private _tryGetCachedToken() {
        var token = this._storage.get(this._username);
        if (Utils.isEmpty(token)) return null;

        this._currentToken = token;
        this.loadProfile();

        return token;
    }
}