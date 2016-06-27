import {Component} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
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
    repositories: IRepository[];
    query: string;
    selectedOrg: string;
    cache: StorageHelper<IRepository>;
    page: number = 1;
    pages = new Subject();


    constructor(
        private _githubService: GithubService,
        private _hamburgerService: HamburgerService,
        private _router: Router
    ) {
        this.cache = new StorageHelper<IRepository>("FavoriteRepositories");
    }

    selectRepo(repository: IRepository) {
        this._router.navigate(['/files', repository.owner.login, repository.name, 'master', 'tree', null]);
    }

    routerOnActivate(current: RouteSegment) {
        this.page = 1;
        this.selectedOrg = current.getParam('org');
        this._githubService.repos(this.page, this.selectedOrg, this.selectedOrg === this._githubService.profile.user.login)
            .subscribe(repos => {
                if (Utils.isEmpty(repos)) {
                    return;
                }
                this.repositories = repos;
            });
    }

    pin(item: IRepository) {
        this.cache.add(item.id.toString(), item);
    }

    showMenu() {
        this._hamburgerService.showMenu();
    }

    showNext() {
        this.page = this.page + 1;
        this._githubService.repos(this.page, this.selectedOrg, this.selectedOrg === this._githubService.profile.user.login)
            .subscribe(repos => {
                if (Utils.isEmpty(repos)) {
                    this.page = 1;
                    this.showPrevious();
                }
                this.repositories = repos;
            });
    }

    showPrevious() {
        if (this.page > 1) {
            this.page = this.page - 1;
        }
        this._githubService.repos(this.page, this.selectedOrg, this.selectedOrg === this._githubService.profile.user.login)
            .subscribe(repos => {
                this.repositories = repos;
            });
    }
}