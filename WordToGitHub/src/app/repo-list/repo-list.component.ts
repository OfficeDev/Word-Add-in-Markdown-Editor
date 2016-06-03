import {Component} from '@angular/core';
import {Router, OnActivate} from '@angular/router';
import {Path} from '../shared/helpers/utilities';
import {StorageHelper} from '../shared/helpers/storage.helper';
import {GithubService, IRepository} from '../shared/services/github.service';

let view = 'repo-list';
@Component({
    templateUrl: Path.template(view),
    styleUrls: [Path.style(view)]
})

export class RepoListComponent implements OnActivate {
    repositories: IRepository[];
    favoriteRepositories: IRepository[];
    private _storage: StorageHelper<IRepository>;

    constructor(
        private _githubService: GithubService,
        private _router: Router) {
        this._storage = new StorageHelper<IRepository>("FavoriteRepositories");
    }

    onSelect(item: IRepository) {
        this._router.navigate(['/repo', item.id]);
    }

    onPin(item: IRepository) {
        this._storage.add(item.id.toString(), item);
        this.favoriteRepositories = _.values(this._storage.all());
    }

    onUnpin(item: IRepository) {
        this._storage.remove(item.id.toString());
        this.favoriteRepositories = _.values(this._storage.all());
    }

    routerOnActivate() {
        this.favoriteRepositories = _.values(this._storage.all());
        this._githubService.repos()
            .then(repos => {
                this.repositories = repos;
            });
    }
}