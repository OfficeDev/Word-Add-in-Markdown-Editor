import {Component} from '@angular/core';
import {OnActivate, Router, RouteSegment} from '@angular/router';
import {Path} from '../shared/helpers/utilities';
import {GithubService, IFile} from '../shared/services/github.service';

let view = 'repo-detail';
@Component({
    templateUrl: Path.template(view)
})

export class RepoDetailComponent implements OnActivate {
    files: Promise<IFile[]>;

    constructor(
        private _githubService: GithubService,
        private _router: Router
    ) { }

    onSelect(item: IFile) {
        this._router.navigate(['/file', item.name]);
    }

    routerOnActivate(current: RouteSegment) {
        let id = +current.getParam('id');
        console.log('Showing data for repository', id);
        this.files = this._githubService.files();
    }
}