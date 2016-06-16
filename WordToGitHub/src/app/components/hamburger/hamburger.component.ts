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

    selectRepository(item: IRepository) {
        this._router.navigate(['/repo', item.name]);
        this.closeMenu();
    }

    selectOrg(item: IProfile) {
        if (Utils.isNull(item)) {
            this._router.navigate(['/repos', this.profile.user.login]);
        }
        else {
            this._router.navigate(['/repos', item.login]);
        }
        this.closeMenu();
    }

    unpin(item: IRepository) {
        this.cache.remove(item.id.toString());
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