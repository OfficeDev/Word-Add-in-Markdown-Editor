import {Component, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {Router, RouteTree, OnActivate, RouteSegment} from '@angular/router';
import {Path, Utils} from '../shared/helpers';
import {GithubService, WordService, ICommit} from '../shared/services';

declare var StringView: any;
let view = 'file-create';
@Component({
    selector: view,
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')]
})

export class FileCreateComponent implements OnActivate, OnDestroy {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    selectedFile: string;

    templateType: string = 'Code sample readme';
    templateContent: string;
    
    newFolder: string;
    commitMessage: string;
    subscriptions: Subscription[];

    constructor(
        private _router: Router,
        private _githubService: GithubService,
        private _wordService: WordService
    ) { }

    ngOnDestroy() {
        _.each(this.subscriptions, subscription => subscription.unsubscribe());
    }

    routerOnActivate(current: RouteSegment, previous: RouteSegment, tree: RouteTree) {
        var parent = tree.parent(current);
        this.selectedRepoName = parent.getParam('repo');
        this.selectedOrg = parent.getParam('org');
        this.selectedBranch = parent.getParam('branch');
        this.selectedPath = decodeURIComponent(current.getParam('path'));
    }

    createFile() {
        var path;

        if (Utils.isNull(this.selectedPath)) {
            path = this.selectedFile;
        }
        else {
            path = this.selectedPath + '/' + (this.newFolder ? this.newFolder + '/' : '') + this.selectedFile;
        }

        var body = {
            message: this.commitMessage || 'Updated ' + this.selectedFile,
            content: this.templateContent || '',
            branch: this.selectedBranch
        };

        return this._githubService.createFile(this.selectedOrg, this.selectedRepoName, path, body)
            .subscribe(response => {
                this._wordService.insertTemplate(this.templateType);
                this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch, 'detail', encodeURIComponent(path)]);
            });
    }
}