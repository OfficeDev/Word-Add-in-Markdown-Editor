import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Path, Utils, StorageHelper} from '../../shared/helpers';
import {GithubService, HamburgerService, IUser, IUserProfile, IRepository} from '../../shared/services';

let view = 'hamburger';
@Component({
    selector: view,
    templateUrl: Path.template(view, 'components/' + view),
    styleUrls: [Path.style(view, 'components/' + view)],
})

export class HamburgerComponent {
    private favouritesCache = new StorageHelper<IRepository>('FavouriteRepositories')

    isShown: Observable<boolean>;
    favoriteRepositories: IRepository[];
    profile: IUserProfile;
    orgs: Observable<IUser>;

    constructor(
        private _githubService: GithubService,
        private _hamburgerService: HamburgerService,
        private _router: Router
    ) {
    }

    ngOnInit() {
        this.isShown = this._hamburgerService.hamburgerMenuShown$;
        this.favoriteRepositories = _.values(this.favouritesCache.all());
        this._githubService.user().subscribe(profile => {
            this.profile = profile;
            this.orgs = this._githubService.orgs(this.profile.login);
        });
    }

    closeMenu() {
        this._hamburgerService.hideMenu();
    }

    selectRepository(item: IRepository) {
        this._router.navigate(['/repo', item.name]);
    }

    selectOrg(item: IUser) {
    }

}