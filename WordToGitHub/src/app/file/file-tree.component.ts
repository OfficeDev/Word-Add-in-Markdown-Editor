import {Component, AfterViewInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {OnActivate, Router, RouteSegment, RouteTree} from '@angular/router';
import {GithubService, BreadcrumbService, IBreadcrumb, IContents} from '../shared/services';
import {Path, Utils, StorageHelper} from '../shared/helpers';
import {SafeNamesPipe, MDFilterPipe} from '../shared/pipes';

let view = 'file-tree';
@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')],
    pipes: [SafeNamesPipe, MDFilterPipe]
})

export class FileTreeComponent implements OnActivate, AfterViewInit {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    files: Observable<IContents[]>;

    constructor(
        private _githubService: GithubService,
        private _breadcrumbService: BreadcrumbService,
        private _router: Router
    ) {
    }

    select(item: IContents) {
        if (item.type === 'dir') {
            this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch, 'tree', encodeURIComponent(item.path)]);
        }
        else {
            this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch, 'detail', encodeURIComponent(item.path)]);
        }
    }

    routerOnActivate(current: RouteSegment, previous: RouteSegment, tree: RouteTree) {
        var parent = tree.parent(current);
        this.selectedRepoName = parent.getParam('repo');
        this.selectedOrg = parent.getParam('org');
        this.selectedBranch = parent.getParam('branch');
        this.selectedPath = current.getParam('path');        
    }

    ngAfterViewInit() {
        if (!Utils.isNull(this.selectedPath)) { this.selectedPath = decodeURIComponent(this.selectedPath); }
        this._breadcrumbService.push(this.selectedPath);

        this.files = this._githubService.files(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath);
    }
}