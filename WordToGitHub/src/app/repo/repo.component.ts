import {Component} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Router, RouteSegment, OnActivate} from '@angular/router';
import {Path, Utils, StorageHelper} from '../shared/helpers';
import {GithubService, HamburgerService, IRepository, IRepositoryCollection} from '../shared/services';
import {SafeNamesPipe} from '../shared/pipes';

let view = 'repo';
@Component({
    templateUrl: Path.template(view, 'repo'),
    styleUrls: [Path.style(view, 'repo')],
    pipes: [SafeNamesPipe]
})

export class RepoComponent implements OnActivate {
    repositories: Observable<IRepository[]>;
    query: string;
    selectedOrg: string;
    cache: StorageHelper<IRepository>;
    constructor(
        private _githubService: GithubService,
        private _hamburgerService: HamburgerService,
        private _router: Router
    ) {
        this.cache = new StorageHelper<IRepository>("FavoriteRepositories");
    }

    onSelect(item: IRepository) {
        this._router.navigate(['/repo', item.name]);
    }

    routerOnActivate(current: RouteSegment) {
        this.selectedOrg = current.getParam('org');
        this.repositories = this._githubService.repos(this.selectedOrg);
    }

    onPin(item: IRepository) {
        this.cache.add(item.id.toString(), item);
    }

    onMenuClicked() {
        this._hamburgerService.showMenu();
    }
}