import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Utils, StorageHelper} from '../../shared/helpers';
import {GithubService, MediatorService, FavoritesService, IUserProfile, IProfile, IRepository, IEventChannel} from '../../shared/services';
import {SafeNamesPipe} from '../../shared/pipes';
import {BaseComponent} from '../base.component';

@Component(Utils.component('hamburger', { pipes: [SafeNamesPipe] }, 'components/hamburger'))

export class HamburgerComponent extends BaseComponent implements OnInit, OnDestroy {
    channel: IEventChannel;
    isShown: Observable<boolean>;
    favoriteRepositories: IRepository[];

    constructor(
        private _githubService: GithubService,
        private _mediatorService: MediatorService,
        private _router: Router,
        private _favoritesService: FavoritesService
    ) {
        super();
        this.channel = this._mediatorService.createEventChannel<boolean>('hamburger');
    }

    ngOnInit() {
        this.isShown = this.channel.source$;
        this.favoriteRepositories = _.values(this._favoritesService.all());
        this._favoritesService.pushDataEvent.source$.subscribe(next => {
            this.favoriteRepositories = _.values(this._favoritesService.all());
        });
    }

    get profile(): IUserProfile {
        return this._githubService.profile;
    }

    closeMenu() {
        this.channel.source.next(false);
    }

    selectRepository(repository: IRepository) {
        this._router.navigate([repository.owner.login, repository.name, 'master']);
        this.closeMenu();
    }

    selectOrg(org: IProfile) {
        if (Utils.isNull(org)) {
            this._router.navigate(['']);
        }
        else {
            this._router.navigate([org.login]);
        }
        this.closeMenu();
    }

    unpin(repository: IRepository) {
        this._favoritesService.unpin(repository);
    }

    signOut() {
        this._githubService.logout();
        this._router.navigate(['/login']);
        this.closeMenu();
    }
}