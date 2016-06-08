import {Component} from '@angular/core';
import {Router, OnActivate} from '@angular/router';
import {Path, Utils, StorageHelper} from '../shared/helpers';
import {GithubService, IRepository} from '../shared/services';

let view = 'repo';
@Component({
    templateUrl: Path.template(view, 'repo'),
    styleUrls: [Path.style(view, 'repo')],
})

export class RepoComponent implements OnActivate {
    repositories: IRepository[];
    favoriteRepositories: IRepository[];
    query: string;

    cache: StorageHelper<IRepository>;

    constructor(
        private _githubService: GithubService,
        private _router: Router
    ) {
        this.cache = new StorageHelper<IRepository>("FavoriteRepositories");
    }

    onSelect(item: IRepository) {
        this._router.navigate(['/repo', item.id]);
    }

    onPin(item: IRepository) {
        item.isPinned = true;
        this.cache.add(item.id.toString(), item);
        this.favoriteRepositories = _.values(this.cache.all());
    }

    onUnpin(item: IRepository) {
        item.isPinned = false;
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