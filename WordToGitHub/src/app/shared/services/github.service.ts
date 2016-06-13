import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Utils, RequestHelper} from '../helpers';
import {IRepository, IRepositoryCollection, IBranch, IToken, IContents, IUserProfile} from './';

declare var Microsoft: any;

@Injectable()
export class GithubService {
    private _baseUrl: string = "";
    private _currentUser: IUserProfile;

    constructor(private _request: RequestHelper) { }

    repos(orgName: string): Observable<IRepositoryCollection> {
        //let page_no = 1;
        let url = "https://api.github.com/orgs/" + orgName + "/repos?page=1&per_page=2";
        //let morePages: boolean = true;

        return this._request.get(url)
            .map((response: Response) => {
                var pageCount = +response.headers.get('total_count');
                var data = response.json() as IRepository[];
                return <IRepositoryCollection>{
                    data: data,
                    page_count: pageCount,
                    next_link: "blah"
                };
            });

        //while (morePages) {
        //    return this._request.get(url).map;
        //    page_no = 
        //}
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

            return () => { };
        });
    }

    loadProfile() {
        // get user profile here
    }

    private _showAuthDialog(observer) {

    }
}