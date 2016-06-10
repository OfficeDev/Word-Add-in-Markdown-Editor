import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Utils, RequestHelper} from '../helpers';
import {IRepository, IBranch, IToken, IContents, IUserProfile} from './';

declare var Microsoft: any;

@Injectable()
export class GithubService {
    private _baseUrl: string = "";
    private _currentUser: IUserProfile;

    constructor(private _request: RequestHelper) { }

    repos(orgName: string): Observable<IRepository[]> {
        let url = Utils.getMockFileUrl("json", "repository");
        return Utils.json<IRepository[]>(this._request.get("https://api.github.com/orgs/" + orgName + "/repos"));
    }

    files(orgName: string, repoName: string, branchName: string): Observable<IContents[]> {
        let url = Utils.getMockFileUrl("json", "file");
        return Utils.json<IContents[]>(this._request.get("https://api.github.com/repos/OfficeDev" + "/" + repoName + "/contents?ref=" + branchName));
    }

    branches(orgName: string, repoName: string): Observable<IBranch[]> {
        let url = Utils.getMockFileUrl("json", "branch");
        return Utils.json<IBranch[]>(this._request.get("https://api.github.com/repos/" + orgName + "/" + repoName + "/branches"));
    }

    file(orgName: string, repoName: string, branchName: string, filePath: string): Observable<string> {
        return Utils.text(this._request.raw("https://raw.githubusercontent.com/" + orgName + "/" + repoName + "/" + branchName + "/" + filePath));
    }

    login(force?: boolean): Observable<IToken> {
        if (!Utils.isWord) return;

        return new Observable<IToken>(observer => {
            var token = this._request.token();
            if (!(force || Utils.isNull(token))) {
                observer.onNext(token);
                return;
            }

            this._showAuthDialog(observer);
        });
    }

    loadProfile() {
        // get user profile here
    }

    private _showAuthDialog(observer) {
        var context = Office.context as any;
        context.ui.displayDialogAsync(window.location.protocol + "//" + window.location.host + "/authorize.html", { height: 35, width: 30 },
            result => {
                var dialog = result.value;
                dialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, args => {
                    dialog.close();

                    if (Utils.isEmpty(args.message)) {
                        observer.onError("No token received");
                        return;
                    }

                    if (args.message.indexOf('access_token') == -1) {
                        observer.onError(JSON.parse(args.message));
                        return;
                    }

                    let token = this._request.token(JSON.parse(args.message));
                    observer.onNext(token);
                });
            });
    }
}