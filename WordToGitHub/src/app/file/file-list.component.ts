import {Component} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {OnActivate, Router, RouteSegment, Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {GithubService, MediatorService, WordService, MarkdownService, IRepository, IBreadcrumb, IBranch, IEventChannel} from '../shared/services';
import {FileTreeComponent} from './file-tree.component';
import {FileDetailComponent} from './file-detail.component';
import {Path, Utils} from '../shared/helpers';
import {SafeNamesPipe} from '../shared/pipes';
import {BreadcrumbComponent} from '../components/breadcrumb/breadcrumb.component';

let view = 'file-list';
@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')],
    pipes: [SafeNamesPipe],
    directives: [ROUTER_DIRECTIVES, BreadcrumbComponent],
    providers: [WordService, MarkdownService]
})

@Routes([
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
    channel: IEventChannel;

    constructor(
        private _githubService: GithubService,
        private _mediatorService: MediatorService,
        private _router: Router
    ) {
        this.channel = this._mediatorService.createEventChannel<boolean>('hamburger');
    }

    selectBranch() {
        this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch.name, 'tree', null]);
    }

    routerOnActivate(current: RouteSegment) {
        this.selectedRepoName = current.getParam('repo');
        this.selectedOrg = current.getParam('org');
        this.selectedBranch = <IBranch>{
            name: current.getParam('branch') || 'master'
        }
        this.branches = this._githubService.branches(this.selectedOrg, this.selectedRepoName)
    }

    navigate(breadcrumb: IBreadcrumb) {
        var path = Utils.isNull(breadcrumb.href) ? null : encodeURIComponent(breadcrumb.href);
        this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch.name, 'tree', path]);
    }

    showMenu() {
        this.channel.event.next(true);
    }    
}