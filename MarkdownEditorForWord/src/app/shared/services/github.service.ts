import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { Authenticator, Storage, IToken } from '@microsoft/office-js-helpers';
import { Utilities, RequestHelper } from '../helpers';
import { IRepository, IBranch, IContents, IProfileMetadata, IUserProfile, ICommit, IUploadCommit } from './';

declare var Microsoft: any;

@Injectable()
export class GithubService {
    private static CLIENT_ID = "61ef07373b60f4f075cd";
    private static REDIRECT_URI = window.location.protocol + "//" + window.location.host;
    private static SCOPE = "repo";
    private _baseUrl: string = "";
    private _profile: IUserProfile;
    private _profileStorage: Storage<IUserProfile>;
    private _authenticator: Authenticator;

    constructor(private _request: RequestHelper) {
        this._profileStorage = new Storage<IUserProfile>('Profile');
        this._authenticator = new Authenticator();
        this._authenticator.endpoints.add('GitHub', {
            clientId: '61ef07373b60f4f075cd',
            baseUrl: 'https://github.com/login',
            authorizeUrl: '/oauth/authorize',
            tokenUrl: 'https://githubproxy.azurewebsites.net/api/GetToken-Developer',
            scope: 'repo',
            state: true
        });
    }

    user(): Observable<IProfileMetadata> {
        return this._request.get<IProfileMetadata>("https://api.github.com/user") as Observable<IProfileMetadata>;
    }

    orgs(username: string): Observable<IProfileMetadata[]> {
        return this._request.get<IProfileMetadata[]>("https://api.github.com/users/" + username + "/orgs") as Observable<IProfileMetadata[]>;
    }

    repos(page: number, orgName: string, personal: boolean): Observable<IRepository[]> {
        var url = personal ? "https://api.github.com/user/repos?page=" + page + "&affiliation=owner,collaborator&sort=updated&direction=desc" : "https://api.github.com/orgs/" + orgName + "/repos?page=" + page;
        return this._request.get<IRepository[]>(url) as Observable<IRepository[]>;
    }

    files(orgName: string, repoName: string, branchName: string, path?: string): Observable<IContents[]> {
        var url = "https://api.github.com/repos/" + orgName + "/" + repoName + "/contents";
        if (!Utilities.isNull(path)) { url += "/" + path; }
        return this._request.get<IContents[]>(url + "?ref=" + branchName) as Observable<IContents[]>;
    }

    branches(orgName: string, repoName: string): Observable<IBranch[]> {
        return this._request.get<IBranch[]>("https://api.github.com/repos/" + orgName + "/" + repoName + "/branches") as Observable<IBranch[]>;
    }

    file(orgName: string, repoName: string, branchName: string, filePath: string): Observable<string> {
        return this._request.getWithMediaHeaders<string>("https://api.github.com/repos/" + orgName + "/" + repoName + "/contents/" + filePath + "?ref=" + branchName) as Observable<string>;
    }

    commits(orgName: string, repoName: string, branchName: string, filePath: string): Observable<ICommit[]> {
        return this._request.get<ICommit[]>("https://api.github.com/repos/" + orgName + "/" + repoName + "/commits?path=" + filePath + "&sha=" + branchName + "&until=" + (new Date().toISOString())) as Observable<ICommit[]>;
    }

    getSha(orgName: string, repoName: string, branchName: string, path?: string): Observable<IContents> {
        var url = "https://api.github.com/repos/" + orgName + "/" + repoName + "/contents";
        if (!Utilities.isNull(path)) { url += "/" + path; }
        return this._request.get<IContents>(url + "?ref=" + branchName) as Observable<IContents>;
    }

    createFile(orgName: string, repoName: string, filePath: string, body: any): Observable<IUploadCommit> {
        return this._request.put<IUploadCommit>("https://api.github.com/repos/" + orgName + "/" + repoName + "/contents/" + filePath, body) as Observable<IUploadCommit>;
    }

    updateFile(orgName: string, repoName: string, filePath: string, body: any): Observable<IUploadCommit> {
        return this._request.put<IUploadCommit>("https://api.github.com/repos/" + orgName + "/" + repoName + "/contents/" + filePath, body) as Observable<IUploadCommit>;
    }

    uploadImage(orgName: string, repoName: string, fileName: string, body: any): Observable<IUploadCommit> {
        return this._request.put<IUploadCommit>("https://api.github.com/repos/" + orgName + "/" + repoName + "/contents/" + fileName, body) as Observable<IUploadCommit>;
    }

    getFileData(filename: string): Observable<string> {
        if (filename == null) return Observable.of('');
        return this._request.raw('assets/templates/' + filename + '.md') as Observable<string>;
    }

    login(): Promise<IUserProfile> {
        return this._authenticator.authenticate('GitHub')
            .then(token => this._getProfile(token))
            .then(profile => this.profile = profile);
    }

    logout() {
        Storage.clearAll();
    }

    get profile(): IUserProfile {
        if (Utilities.isEmpty(this._profile)) {
            this._profile = this._profileStorage.values()[0];

            if (!Utilities.isEmpty(this._profile)) {
                this._request.token(this._profile.token);
            }
        }

        return this._profile;
    }

    set profile(value: IUserProfile) {
        if (!Utilities.isEmpty(value)) {
            this._profile = value;
            this._profileStorage.add(value.user.login, value);
        }
    }

    private _getProfile(token: IToken) {
        var _userMetadata: IProfileMetadata;
        this._request.token(token);
        return this.user().toPromise()
            .then(userMetadata => {
                _userMetadata = userMetadata;
                return this.orgs(_userMetadata.login).toPromise();
            })
            .then(orgs => {
                return {
                    token: token,
                    orgs: orgs,
                    user: _userMetadata
                };
            })
    }
}