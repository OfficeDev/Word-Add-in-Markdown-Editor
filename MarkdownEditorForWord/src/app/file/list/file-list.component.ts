import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { GithubService, MediatorService, IBranch, IEventChannel } from '../../shared/services';
import { BaseComponent } from '../../shared/components';
import './file-list.component.scss';

@Component({
    selector: 'file-list',
    templateUrl: 'file-list.component.html'
})
export class FileListComponent extends BaseComponent implements OnInit, OnDestroy {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: IBranch;
    branches: Observable<IBranch[]>;
    channel: IEventChannel;

    constructor(
        private _githubService: GithubService,
        private _mediatorService: MediatorService,
        private _router: Router,
        private _route: ActivatedRoute
    ) {
        super();
        this.channel = this._mediatorService.createEventChannel<boolean>('hamburger');
    }

    ngOnInit() {
        var subscription = this._route.params.subscribe(params => {
            this.selectedRepoName = params['repo'];
            this.selectedOrg = params['org'];
            this.selectedBranch = <IBranch>{ name: 'master' };
            this.branches = this._githubService.branches(this.selectedOrg, this.selectedRepoName);
        });

        this.markDispose(subscription);
    }

    selectBranch(branchName: string) {
        this._router.navigate([this.selectedOrg, this.selectedRepoName, branchName]);
        this.selectedBranch.name = branchName;
    }

    showMenu() {
        this.channel.source.next(true);
    }
}