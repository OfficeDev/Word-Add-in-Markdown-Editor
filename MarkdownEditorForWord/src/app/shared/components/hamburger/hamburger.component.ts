﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Utilities } from '../../helpers';
import { GithubService, MediatorService, FavoritesService, IUserProfile, IProfile, IRepository, IEventChannel } from '../../services';
import { BaseComponent } from '../base.component';
import './hamburger.component.scss';

@Component({
    selector: 'hamburger',
    templateUrl: 'hamburger.component.html'
})
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
        this.favoriteRepositories = this._favoritesService.values();
        this._favoritesService.pushDataEvent.source$.subscribe(next => {
            this.favoriteRepositories = this._favoritesService.values();
        });
    }

    get profile(): IUserProfile {
        return this._githubService.profile;
    }

    closeMenu() {
        this.channel.source.next(false);
    }

    selectRepository(repository: IRepository) {
        appInsights.trackEvent('Navigate to repository from hamburger');
        this._router.navigate([repository.owner.login, repository.name, 'master']);
        this.closeMenu();
    }

    selectOrg(org: IProfile) {
        if (Utilities.isNull(org)) {
            appInsights.trackEvent('Navigate to org from hamburger');
            this._router.navigate(['']);
        }
        else {
            this._router.navigate([org.login]);
        }
        this.closeMenu();
    }

    unpin(repository: IRepository) {
        appInsights.trackEvent('Unpin repository from hamburger');
        this._favoritesService.unpin(repository);
        repository.isPinned = false;
    }

    signOut() {
        appInsights.trackEvent('Logout from hamburger');
        appInsights.clearAuthenticatedUserContext();
        this._githubService.logout();
        this._router.navigate(['/login']);
        this.closeMenu();
    }
}