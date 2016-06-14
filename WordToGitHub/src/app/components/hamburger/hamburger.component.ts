import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Path, Utils, StorageHelper} from '../../shared/helpers';
import {GithubService, HamburgerService, IUserProfile, IRepository} from '../../shared/services';

let view = 'hamburger';
@Component({
    selector: view,
    templateUrl: Path.template(view, 'components/' + view),
    styleUrls: [Path.style(view, 'components/' + view)],
})

export class HamburgerComponent {
    private _favouritesCache = new StorageHelper<IRepository>('FavouriteRepositories')

    isShown: Observable<boolean>;
    favoriteRepositories: IRepository[];

    constructor(
        private _githubService: GithubService,
        private _hamburgerService: HamburgerService,
        private _router: Router
    ) {
    }

    ngOnInit() {
        this.isShown = this._hamburgerService.hamburgerMenuShown$;
        this.favoriteRepositories = _.values(this._favouritesCache.all());
    }

    get profile(): IUserProfile {
        return this._githubService.profile;
    }

    closeMenu() {
        this._hamburgerService.hideMenu();
    }

    selectRepository(item: IRepository) {
        this._router.navigate(['/repo', item.name]);
    }
}