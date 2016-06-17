import {Component} from '@angular/core';
import {Router, RouteTree, OnActivate, RouteSegment} from '@angular/router';
import {Path, Utils} from '../shared/helpers';
import {GithubService, WordService} from '../shared/services';

let view = 'file-detail';
@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')],
    providers: [WordService]
})

export class FileDetailComponent implements OnActivate {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    selectedFile: string;

    constructor(
        private _router: Router,
        private _githubService: GithubService,
        private _wordService: WordService
    ) { }

    routerOnActivate(current: RouteSegment, previous: RouteSegment, tree: RouteTree) {
        var parent = tree.parent(current);
        this.selectedRepoName = parent.getParam('repo');
        this.selectedOrg = parent.getParam('org');
        this.selectedBranch = parent.getParam('branch');
        this.selectedPath = decodeURIComponent(current.getParam('path'));
        console.log('Showing for: ' + this.selectedPath);
        //this.selectedFile = this._githubService.files(this.selectedOrg, this.selectedRepoName, this.selectedBranch);
    }
}