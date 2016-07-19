import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
//import {BaseComponent} from '../../components';
import {Utils, StorageHelper} from '../../shared/helpers';
import {GithubService, MediatorService, IUserProfile, IProfile, IRepository, IEventChannel} from '../../shared/services';
import {SafeNamesPipe} from '../../shared/pipes';

@Component(Utils.component('hamburger', { pipes: [SafeNamesPipe] }, 'components/hamburger'))

export class HamburgerComponent implements OnInit {
    cache: StorageHelper<IRepository>;
    channel: IEventChannel;
    isShown: Observable<boolean>;
    favoriteRepositories: IRepository[];
    
    constructor(
        private _githubService: GithubService,
        private _mediatorService: MediatorService,
        private _router: Router
    ) {
        //super();
        this.cache = new StorageHelper<IRepository>("FavoriteRepositories");
        this.channel = this._mediatorService.createEventChannel<boolean>('hamburger');
        //this.markDispose(this.channel);
    }

    ngOnInit() {
        this.isShown = this.channel.source$;
        this.favoriteRepositories = _.values(this.cache.all());
    }

    get profile(): IUserProfile {
        return this._githubService.profile;
    }

    closeMenu() {
        this.channel.event.next(false);
    }

    selectRepository(repository: IRepository) {
        this._router.navigate(['/files', repository.owner.login, repository.name, 'master', 'tree', null]);
        this.closeMenu();
    }

    selectOrg(org: IProfile) {
        if (Utils.isNull(org)) {
            this._router.navigate(['/repos']);
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
}