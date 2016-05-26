import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Utils} from '../helpers/utilities';

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


@Injectable()
export class GithubService {
    private _baseUrl: string = "";

    constructor(private _http: Http) {
    }

    repos() {
        let url = Utils.getMockFileUrl("json", "repository");
        return this._http.get(url);
    }

    files() {
        let url = Utils.getMockFileUrl("json", "file");
        return this._http.get(url);
    }

    file(name: string) {
        let url = Utils.getMockFileUrl("md", name);
        return this._http.get(url);
    }
}