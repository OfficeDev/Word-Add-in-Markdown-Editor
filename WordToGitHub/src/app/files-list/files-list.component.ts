import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Path} from '../shared/helpers/utilities';
import {GithubService, IFile} from '../shared/services/github.service';

let view = 'files-list';
@Component({
    selector: view,
    templateUrl: Path.template(view)
})

export class FilesListComponent implements OnInit {
    files: any;

    constructor(
        private _githubService: GithubService,
        private _router: Router
    ) { }

    onSelect(item: IFile) {
        this._router.navigate(['/repositories/:repoId/files/:fileId', {
            reposId: 0,
            fileId: item.id
        }]);
    }

    ngOnInit(): any {
        this.files = this._githubService.files();
    }
}