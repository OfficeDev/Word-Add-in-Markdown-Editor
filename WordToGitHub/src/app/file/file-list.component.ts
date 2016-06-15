import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {OnActivate, Router, RouteSegment} from '@angular/router';
import {GithubService, HamburgerService, MarkdownService, WordService, IRepository, IContents, IBranch} from '../shared/services';
import {Path, Utils, StorageHelper, Base64} from '../shared/helpers';
import {SafeNamesPipe, MDFilterPipe} from '../shared/pipes';

let view = 'file-list';
@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')],
    providers: [MarkdownService, WordService],
    pipes: [SafeNamesPipe, MDFilterPipe]
})

export class FileListComponent implements OnActivate, OnInit {
    selectedOrg: string = "OfficeDev";
    selectedRepoName: string;
    selectedBranch: IBranch = {
        name: "master"
    };
    files: Observable<IContents[]>;
    branches: Observable<IBranch[]>;
    base64: Base64;

    constructor(
        private _githubService: GithubService,
        private _wordService: WordService,
        private _hamburgerService: HamburgerService,
        private _router: Router) {
    }

    ngOnInit(): any {
    }

    onSelectBranch(item: IBranch) {
        this.files = this._githubService.files(this.selectedOrg, this.selectedRepoName, this.selectedBranch.name);

    }

    onSelect(item: IContents) {
        this._githubService.file(this.selectedOrg, this.selectedRepoName, this.selectedBranch.name, item.path)
            .subscribe(html => {
                if (Utils.isEmpty(html)) return;
                this._wordService.insertHtml(html);
            });
    }

    routerOnActivate(current: RouteSegment) {
        this.selectedRepoName = current.getParam('name');
        console.log('Showing data for repository', this.selectedRepoName);


        this.files = this._githubService.files(this.selectedOrg, this.selectedRepoName, this.selectedBranch.name)



        this.branches = this._githubService.branches(this.selectedOrg, this.selectedRepoName)
    }

    onMenuClicked() {
        this._hamburgerService.showMenu();
    }

  
}