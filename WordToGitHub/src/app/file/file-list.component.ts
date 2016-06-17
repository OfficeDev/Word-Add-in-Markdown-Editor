import {Component} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {OnActivate, Router, RouteSegment, Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {GithubService, HamburgerService, IRepository, IBranch} from '../shared/services';
import {FileTreeComponent, FileDetailComponent} from '../components';
import {Path, Utils} from '../shared/helpers';
import {SafeNamesPipe} from '../shared/pipes';

@Component({
    templateUrl: Path.template('file-list', 'file'),
    styleUrls: [Path.style('file-list', 'file')],
    pipes: [SafeNamesPipe],
    directives: [ROUTER_DIRECTIVES]
})

@Routes([
    {
        path: '/tree',
        component: FileTreeComponent
    },
    {
        path: '/tree/:path',
        component: FileTreeComponent
    },
    {
        path: '/detail/:path',
        component: FileDetailComponent
    }
])

export class FileListComponent implements OnActivate {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: IBranch;
    branches: Observable<IBranch[]>;

    constructor(
        private _githubService: GithubService,
        private _hamburgerService: HamburgerService,
        private _router: Router) {
    }

    selectBranch() {
        this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch.name, 'tree']);
    }

    routerOnActivate(current: RouteSegment) {
        this.selectedRepoName = current.getParam('repo');
        this.selectedOrg = current.getParam('org');
        this.selectedBranch = <IBranch>{
            name: current.getParam('branch') || 'master'
        }
        this.branches = this._githubService.branches(this.selectedOrg, this.selectedRepoName)
    }

    showMenu() {
        this._hamburgerService.showMenu();
    }
}