import {Component} from '@angular/core';
import {Router, OnActivate} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Path, Utils, StorageHelper} from '../../shared/helpers';
import {GithubService, HamburgerService, IUserProfile, IProfile, IRepository} from '../../shared/services';
import {SafeNamesPipe} from '../../shared/pipes';

let view = 'hamburger';
@Component({
    selector: view,
    templateUrl: Path.template(view, 'components/' + view),
    styleUrls: [Path.style(view, 'components/' + view)],
    pipes: [SafeNamesPipe]
})

export class HamburgerComponent implements OnActivate {
    cache: StorageHelper<IRepository>;

    isShown: Observable<boolean>;
    favoriteRepositories: IRepository[];
    isViewModeSet: boolean;

    constructor(
        private _githubService: GithubService,
        private _hamburgerService: HamburgerService,
        private _router: Router
    ) {
        this.cache = new StorageHelper<IRepository>("FavoriteRepositories");
    }

    ngOnInit() {
        this.isShown = this._hamburgerService.hamburgerMenuShown$;
        this.favoriteRepositories = _.values(this.cache.all());
    }

    get profile(): IUserProfile {
        return this._githubService.profile;
    }

    closeMenu() {
        this._hamburgerService.hideMenu();
    }

    selectRepository(repository: IRepository) {
        this._router.navigate(['/files', repository.owner.login, repository.name, 'master', 'tree', null]);
        this.closeMenu();
    }

    selectOrg(org: IProfile) {
        if (Utils.isNull(org)) {
            this._router.navigate(['/repos', this.profile.user.login]);
        }
        else {
            this._router.navigate(['/repos', org.login]);
        }
        this.closeMenu();
    }

    unpin(repository: IRepository) {
        this.cache.remove(repository.id.toString());
        this.favoriteRepositories = _.values(this.cache.all());
    }

    signOut() {
        this._githubService.logout();
        this._router.navigate(['/login']);
        this.closeMenu();
    }

    routerOnActivate() {
        this.isViewModeSet = true;
    }
}