import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Router, ActivatedRoute} from '@angular/router';
import {GithubService, MediatorService, IBreadcrumb, IContents, WordService, ISubjectChannel} from '../shared/services';
import {Utils, StorageHelper} from '../shared/helpers';
//import {BaseComponent} from '../components';
import {SafeNamesPipe, MDFilterPipe} from '../shared/pipes';

let view = 'file-tree';

@Component(Utils.component('file-tree', {
    pipes: [SafeNamesPipe, MDFilterPipe]
}, 'file'))
export class FileTreeComponent implements OnInit {
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
        private _router: Router,
        private _route: ActivatedRoute
    ) {
        //super();
        this.channel = this._mediatorService.createSubjectChannel<IBreadcrumb>('breadcrumbs') as ISubjectChannel;
        //this.markDispose(this.channel);
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

    ngOnInit() {
        var subscription = this._route.params.subscribe(params => {
            this.selectedRepoName = params['repo'];
            this.selectedOrg = params['org'];
            this.selectedBranch = params['branch']
            this.selectedPath = decodeURIComponent(params['path']);
        });

        //this.markDispose(subscription);
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