import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {OnActivate, Router, RouteSegment} from '@angular/router';
import {GithubService, MarkdownService, WordService, IRepository, IContents, IBranch} from '../shared/services';
import {Path, Utils, StorageHelper} from '../shared/helpers';

let view = 'file-list';
@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')],
    providers: [MarkdownService, WordService]
})

export class FileListComponent implements OnActivate, OnInit {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: IBranch = {
        name: "master"
    };
    files: Observable<IContents[]>;
    branches: Observable<IBranch[]>;

    constructor(
        private _githubService: GithubService,
        private _wordService: WordService,
        private _router: Router) {
    }

    ngOnInit(): any {
    }

    onSelectBranch(item: IBranch) {
        this.files = this._githubService.files(this.selectedOrg, this.selectedRepoName, this.selectedBranch.name);

    }

    onSelect(item: IContents) {
        this._githubService.file(this.selectedOrg, this.selectedRepoName, this.selectedBranch.name, item.path)
            .subscribe(md => {
                if (Utils.isEmpty(md)) return;
                this._wordService.insertHtml(md);
            });
    }

    routerOnActivate(current: RouteSegment) {
        this.selectedOrg = "OfficeDev";
        this.selectedRepoName = current.getParam('name');
        console.log('Showing data for repository', this.selectedRepoName);


        this.files = this._githubService.files(this.selectedOrg, this.selectedRepoName, this.selectedBranch.name)



        this.branches = this._githubService.branches(this.selectedOrg, this.selectedRepoName)
    }
}