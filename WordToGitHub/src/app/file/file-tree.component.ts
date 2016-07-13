/// <reference path="file-detail.component.ts" />
import {Component, AfterViewInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {OnActivate, Router, RouteSegment, RouteTree} from '@angular/router';
import {GithubService, MediatorService, IBreadcrumb, IContents, WordService, ISubjectChannel} from '../shared/services';
import {Path, Utils, StorageHelper} from '../shared/helpers';
import {SafeNamesPipe, MDFilterPipe} from '../shared/pipes';

let view = 'file-tree';

@Component({
    selector: view,
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
    channel: ISubjectChannel;

    static id: number = 1;

    constructor(
        private _githubService: GithubService,
        private _mediatorService: MediatorService,
        private _wordService: WordService,
        private _router: Router
    ) {
        this.channel = this._mediatorService.createSubjectChannel<IBreadcrumb>('breadcrumbs') as ISubjectChannel;
    }

    select(item: IContents) {
        if (item.type === 'dir') {
            this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch, 'tree', encodeURIComponent(item.path)]);
        }
        else {
            this.addBreadcrumb(item.path);
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

    private addBreadcrumb(path: string) {
        var text = Utils.isNull(path) ? 'Root' : _.last(path.split('/'));
        this.channel.dataSource.next(<IBreadcrumb>{
            key: FileTreeComponent.id++,
            text: text,
            href: path
        });
    }

    ngAfterViewInit() {
        if (!Utils.isNull(this.selectedPath)) { this.selectedPath = decodeURIComponent(this.selectedPath); }
        this.addBreadcrumb(this.selectedPath);

        this.files = this._githubService.files(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath);
    }

    createFile() {
        this._router.navigate(['/create', this.selectedOrg, this.selectedRepoName, this.selectedBranch, encodeURIComponent(this.selectedPath)]);
    }
}