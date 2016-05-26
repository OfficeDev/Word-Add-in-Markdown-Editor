import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {MarkdownService} from '../markdown/markdown.service';
import {REPOSITORIES} from "../shared/repositories";
import {FILES} from "../shared/files";
import {Repository} from '../shared/repository';
import {MdFile} from '../shared/file';

@Injectable()
export class GithubService {
    constructor(
        private _http: Http,
        private _markdownService: MarkdownService
    ) {

    }

    authenticate() {

    }

    getFileData() {
        return this._http.get('assets/mock/simple-file.md')
            .map((response: Response) => {
                let text = response.text();
                return this._markdownService.convertToHtml(text);
            });
    }
    
    getRepositoryIndex(item: Repository) {
        return REPOSITORIES.indexOf(item);
    }

    getFileIndex(item: MdFile) {
        return FILES.indexOf(item);
    }

    getAllRepositoriesForUser() {
        return Promise.resolve(REPOSITORIES);
    }

    getAllMDFilesInRepo() {
        return Promise.resolve(FILES);
    }
    
}