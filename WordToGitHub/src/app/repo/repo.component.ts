import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {Router, ActivatedRoute} from '@angular/router';
import {GithubService, MediatorService, FavoritesService} from '../shared/services';
import {Utils, StorageHelper} from '../shared/helpers';
import {InfiniteScroll} from 'angular2-infinite-scroll';
import {IRepository, IRepositoryCollection, IEventChannel} from '../shared/services';
import {SafeNamesPipe} from '../shared/pipes';

@Component(Utils.component('repo', {
    pipes: [SafeNamesPipe],
    directives: [InfiniteScroll]
}))
export class RepoComponent implements OnInit {
    private _page = 0;

    repositories: IRepository[] = [];
    selectedOrg: string;
    cache: StorageHelper<IRepository>;
    channel: IEventChannel;

    constructor(
        private _githubService: GithubService,
        private _mediatorService: MediatorService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _favoritesService: FavoritesService
    ) {
        this.cache = new StorageHelper<IRepository>("FavoriteRepositories");
        this.channel = this._mediatorService.createEventChannel<Event>('hamburger');
    }

    ngOnInit() {
        var subscription = this._route.params.subscribe(params => {
            this.selectedOrg = params['org'] || this._githubService.profile.user.login;
            this.load();
        });
    }

    selectRepo(repository: IRepository) {
        this._router.navigate([repository.owner.login, repository.name, 'master']);
    }

    pin(item: IRepository) {
        this.cache.add(item.id.toString(), item);
        this._favoritesService.pushData(item);
    }

    load() {
        var personal = this.selectedOrg === this._githubService.profile.user.login;
        this._githubService.repos(this._page++, this.selectedOrg, personal).subscribe(data => {
            data.forEach(item => this.repositories.push(item));
        });
    }
}