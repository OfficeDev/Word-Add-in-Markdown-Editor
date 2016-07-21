import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Router, ActivatedRoute} from '@angular/router';
import {GithubService, MediatorService, IBreadcrumb, IContents, WordService, ISubjectChannel} from '../shared/services';
import {Utils, StorageHelper} from '../shared/helpers';
import {BaseComponent} from '../components/base.component';
import {SafeNamesPipe, MDFilterPipe} from '../shared/pipes';

let view = 'file-tree';

@Component(Utils.component('file-tree', {
    pipes: [SafeNamesPipe, MDFilterPipe]
}, 'file'))
export class FileTreeComponent extends BaseComponent implements OnInit, OnDestroy {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    files: Observable<IContents[]>;
    channel: ISubjectChannel;

    constructor(
        private _githubService: GithubService,
        private _mediatorService: MediatorService,
        private _wordService: WordService,
        private _router: Router,
        private _route: ActivatedRoute
    ) {
        super();
        this.channel = this._mediatorService.createSubjectChannel<IBreadcrumb>('breadcrumbs') as ISubjectChannel;
    }

    select(item: IContents) {
        if (item.type === 'dir') {
            this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch, encodeURIComponent(item.path)]);
        }
        else {
            this.addBreadcrumb(item.path);
            this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch,encodeURIComponent(item.path), 'detail']);
        }
    }

    ngOnInit() {
        var subscription1 = this._router.routerState.parent(this._route).params.subscribe(params => {
            this.selectedRepoName = params['repo'];
            this.selectedOrg = params['org'];
            this.selectedBranch = params['branch']
        });

        var subscription2 = this._route.params.subscribe(params => {
            this.selectedPath = Utils.isEmpty(params['path']) ? '' : decodeURIComponent(params['path']);
            this.addBreadcrumb(this.selectedPath);
            this.files = this._githubService.files(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath);
        });

        this.markDispose([subscription1, subscription2]);
    }

    ngOnDestroy() {
        console.log("FileTreeComponent destroyed " + new Date());
        super.ngOnDestroy();
    }

    private addBreadcrumb(path: string) {
        var text = Utils.isEmpty(path) ? 'Root' : _.last(path.split('/'));
        this.channel.source.next(<IBreadcrumb>{
            text: text,
            href: path
        });
    }

    createFile() {
        this.selectedPath = Utils.isNull(this.selectedPath) ? '%2f': encodeURIComponent(this.selectedPath); 
        this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath, 'create']);
    }
}