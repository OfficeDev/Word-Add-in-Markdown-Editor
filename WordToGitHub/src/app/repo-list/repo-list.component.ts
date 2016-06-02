import {Component} from '@angular/core';
import {Router, OnActivate} from '@angular/router';
import {Path} from '../shared/helpers/utilities';
import {GithubService, IRepository} from '../shared/services/github.service';

let view = 'repo-list';
@Component({
    templateUrl: Path.template(view)
})

export class RepoListComponent implements OnActivate {
    repositories: IRepository[];

    constructor(
        private _githubService: GithubService,
        private _router: Router) { }

    onSelect(item: IRepository) {
        this._router.navigate(['/repo', item.id]);
    }

    routerOnActivate() {
        this._githubService.repos()
            .then(repos => { this.repositories = repos; });
    }
}