import {Component} from '@angular/core';
import {Router, OnActivate} from '@angular/router';
import {Path, Utils, StorageHelper} from '../shared/helpers';
import {GithubService, Repo} from '../shared/services';

let view = 'repo';
@Component({
    templateUrl: Path.template(view, 'repo'),
    styleUrls: [Path.style(view, 'repo')],
})

export class RepoComponent implements OnActivate {
    repositories: Repo[];
    favoriteRepositories: Repo[];
    query: string;

    cache: StorageHelper<Repo>;

    constructor(
        private _githubService: GithubService,
        private _router: Router
    ) {
        this.cache = new StorageHelper<Repo>("FavoriteRepositories");
    }

    onSelect(item: Repo) {
        this._router.navigate(['/repo', item.id]);
    }

    onPin(item: Repo) {
        this.cache.add(item.id.toString(), item);
        this.favoriteRepositories = _.values(this.cache.all());
    }

    onUnpin(item: Repo) {
        this.cache.remove(item.id.toString());
        this.favoriteRepositories = _.values(this.cache.all());
    }

    routerOnActivate() {
        var _that = this;
        this.favoriteRepositories = _.values(this.cache.all());
        this._githubService.repos()
            .then(repos => {
                this.repositories = repos;
            });
    }
}