import {Component, OnInit} from '@angular/core';
import {GithubService, IRepository} from '../shared/services/github.service';
import {Router} from '@angular/router';

@Component({
    selector: 'repos',
    templateUrl: './repos.component.html'
})

export class ReposComponent implements OnInit {
    repositories;

    constructor(
        private _githubService: GithubService,
        private _router: Router) { }

    onSelect(item: IRepository) {
        this._router.navigate(['/repos/:repoId/files', {
            repoId: item.id
        }]);
    }

    ngOnInit(): any {
        this.repositories = this._githubService.repos();
    }
}