import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { GithubService, MediatorService, FavoritesService, IRepository, IRepositoryCollection, IEventChannel } from '../shared/services';
import { Utilities } from '../shared/helpers';
import { SafeNamesPipe } from '../shared/pipes';
import { BaseComponent } from '../shared/components';
import './repo.component.scss';

@Component({
    selector: 'repo',
    templateUrl: 'repo.component.html'
})
export class RepoComponent extends BaseComponent implements OnInit {
    private _page = 0;

    repositories: IRepository[] = [];
    selectedOrg: string;
    channel: IEventChannel;
    loadComplete: boolean;

    constructor(
        private _githubService: GithubService,
        private _mediatorService: MediatorService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _favoritesService: FavoritesService
    ) {
        super();
        this.channel = this._mediatorService.createEventChannel<Event>('hamburger');
    }

    ngOnInit() {
        var sub = this._route.params.subscribe(params => {
            this.selectedOrg = params['org'] || this._githubService.profile.user.login;
            this.load(true);
        });

        this.markDispose(sub);
    }

    selectRepo(repository: IRepository) {
        this._router.navigate([repository.owner.login, repository.name, 'master']);
    }

    pin(item: IRepository) {
        this._favoritesService.pin(item);
    }

    load(clear: boolean = false) {
        if (clear) {
            this.repositories = [];
            this.loadComplete = false;
        }
        var personal = this.selectedOrg === this._githubService.profile.user.login;
        var sub = this._githubService
            .repos(this._page++, this.selectedOrg, personal)
            .subscribe(data => {
                if (Utilities.isEmpty(data)) {
                    this.loadComplete = true;
                    return;
                }
                this.repositories = this.repositories.concat(data);
            });

        this.markDispose(sub);
    }

    showMenu() {
        this.channel.source.next(true);
    }
}