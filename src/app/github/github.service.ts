import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import MarkdownService from '../markdown/markdown.service';

@Injectable()
export default class GithubService {
    constructor(
        private _http: Http,
        private _markdownService: MarkdownService
    ) {

    }

    authenticate() {

    }

    getFileData() {
        return this._http.get('/www/assets/mock/readme.md')
            .map((response: Response) => {
                let text = response.text();
                return this._markdownService.convertToHtml(text);
            });
    }
}