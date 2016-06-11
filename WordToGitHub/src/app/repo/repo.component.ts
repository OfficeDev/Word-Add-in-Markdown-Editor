import {Component} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Router, RouteSegment, OnActivate} from '@angular/router';
import {Path, Utils, StorageHelper} from '../shared/helpers';
import {GithubService, IRepository} from '../shared/services';

let view = 'repo';
@Component({
    templateUrl: Path.template(view, 'repo'),
    styleUrls: [Path.style(view, 'repo')],
})

export class RepoComponent implements OnActivate {
    repositories: Observable<IRepository[]>;
    favoriteRepositories: IRepository[];
    query: string;
    selectedOrg: string;

    cache: StorageHelper<IRepository>;

    constructor(
        private _githubService: GithubService,
        private _router: Router
    ) {
        this.cache = new StorageHelper<IRepository>("FavoriteRepositories");
    }

    onSelect(item: IRepository) {
        this._router.navigate(['/repo', item.name]);
    }

    onPin(item: IRepository) {
        this.cache.add(item.id.toString(), item);
        this.favoriteRepositories = _.values(this.cache.all());
    }

    onUnpin(item: IRepository) {
        this.cache.remove(item.id.toString());
        this.favoriteRepositories = _.values(this.cache.all());
    }

    routerOnActivate(current: RouteSegment) {
        this.selectedOrg = "OfficeDev";
        var _that = this;
        this.favoriteRepositories = _.values(this.cache.all());
        this.repositories = this._githubService.repos(this.selectedOrg);
    }
}