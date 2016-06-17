import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs/Rx';
import {Utils, RequestHelper, StorageHelper} from '../helpers';
import {IRepository, IBranch, IToken, IContents, IProfileMetadata, IUserProfile} from './';

declare var Microsoft: any;

@Injectable()
export class GithubService {
    private _baseUrl: string = "";
    private _profile: IUserProfile;
    private _profileStorage: StorageHelper<IUserProfile>;

    constructor(private _request: RequestHelper) {
        this._profileStorage = new StorageHelper<IUserProfile>('Profile');
    }

    user(): Observable<IProfileMetadata> {
        return this._request.get<IProfileMetadata>("https://api.github.com/user") as Observable<IProfileMetadata>;
    }

    orgs(username: string): Observable<IProfileMetadata> {
        return this._request.get<IProfileMetadata>("https://api.github.com/users/" + username + "/orgs") as Observable<IProfileMetadata>;
    }

    repos(orgName: string, personal: boolean): Observable<IRepository[]> {
        var url = personal ? "https://api.github.com/user/repos" : "https://api.github.com/orgs/" + orgName + "/repos";
        return this._request.get<IRepository[]>(url) as Observable<IRepository[]>;
    }

    files(orgName: string, repoName: string, branchName: string): Observable<IContents[]> {
        return this._request.get<IContents[]>("https://api.github.com/repos/OfficeDev" + "/" + repoName + "/contents?ref=" + branchName) as Observable<IContents[]>;
    }

    branches(orgName: string, repoName: string): Observable<IBranch[]> {
        return this._request.get<IBranch[]>("https://api.github.com/repos/" + orgName + "/" + repoName + "/branches") as Observable<IBranch[]>;
    }

    file(orgName: string, repoName: string, branchName: string, filePath: string): Observable<string> {
        return this._request.raw("https://raw.githubusercontent.com/" + orgName + "/" + repoName + "/" + branchName + "/" + filePath) as Observable<string>;
    }

    login(): Observable<IUserProfile> {
        if (!Utils.isWord) return;

        return Observable.create((observer: Observer<IUserProfile>) => {
            this._showAuthDialog(observer);
        });
    }

    logout() {
        this._profileStorage.clear();
    }

    get profile(): IUserProfile {
        if (Utils.isEmpty(this._profile)) {
            this._profile = this._profileStorage.first();

            if (!Utils.isEmpty(this._profile)) {
                this._request.token(this._profile.token);
            }
        }

        return this._profile;
    }

    set profile(value: IUserProfile) {
        if (!Utils.isEmpty(value)) {
            this._profile = value;
            this._profileStorage.add(value.user.login, value);
        }
    }

    private _showAuthDialog(observer: Observer<IUserProfile>) {
        var context = Office.context as any;
        context.ui.displayDialogAsync(window.location.protocol + "//" + window.location.host + "/authorize.html", { height: 35, width: 30 },
            result => {
                var dialog = result.value;
                dialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, args => {
                    dialog.close();

                    try {
                        if (Utils.isEmpty(args.message)) {
                            observer.error("No token received");
                        }

                        if (args.message.indexOf('access_token') == -1) {
                            observer.error(JSON.parse(args.message));
                        }

                        let token = this._request.token(JSON.parse(args.message));
                        if (Utils.isNull(token)) {
                            observer.error("Unable to parse token");
                        }

                        this.user().subscribe(userMetadata => {
                            this.orgs(userMetadata.login).subscribe(orgs => {
                                this.profile = <IUserProfile>{
                                    user: userMetadata,
                                    orgs: orgs,
                                    token: token
                                };

                                observer.next(this.profile);
                                observer.complete();
                            }, error => Utils.error(error));
                        }, error => Utils.error(error));
                    }
                    catch (exception) {
                        Utils.error(exception);
                    }
                });
            });
    }
}