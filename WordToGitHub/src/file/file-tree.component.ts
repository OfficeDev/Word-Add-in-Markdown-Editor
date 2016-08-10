import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Router, ActivatedRoute} from '@angular/router';
import {GithubService, IContents, WordService} from '../shared/services';
import {Utils, StorageHelper} from '../shared/helpers';
import {BaseComponent} from '../components/base.component';
import {AsyncViewComponent} from '../components/notification/async-view.component';
import {SafeNamesPipe, MDFilterPipe} from '../shared/pipes';

let view = 'file-tree';

@Component({
    selector: 'file-tree',
    templateUrl: './file-tree.component.html',
    styleUrls: ['./file-tree.component.scss'],
    directives: [AsyncViewComponent],
    pipes: [SafeNamesPipe, MDFilterPipe]
})
export class FileTreeComponent extends BaseComponent implements OnInit, OnDestroy {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    files: Observable<IContents[]>;

    constructor(
        private _githubService: GithubService,
        private _wordService: WordService,
        private _router: Router,
        private _route: ActivatedRoute
    ) {
        super();
    }

    select(item: IContents) {
        if (item.type === 'dir') {
            this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch, encodeURIComponent(item.path)]);
        }
        else {
            this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch,encodeURIComponent(item.path), 'detail']);
        }
    }

    ngOnInit() {
        var subscription1 = this._router.routerState.parent(this._route).params.subscribe(params => {
            this.selectedRepoName = params['repo'];
            this.selectedOrg = params['org'];
        });

        var subscription2 = this._route.params.subscribe(params => {
            this.selectedBranch = params['branch'];            
            this.selectedPath = Utils.isEmpty(params['path']) ? '' : decodeURIComponent(params['path']);
            this.files = this._githubService.files(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath);
        });

        this.markDispose([subscription1, subscription2]);
    }

    createFile() {
        this.selectedPath = Utils.isNull(this.selectedPath) ? encodeURIComponent('/root'): encodeURIComponent(this.selectedPath); 
        this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath, 'create']);
    }
}