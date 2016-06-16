import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {OnActivate, Router, RouteSegment} from '@angular/router';
import {GithubService, HamburgerService, MarkdownService, WordService, IRepository, IContents, IBranch} from '../shared/services';
import {Path, Utils, StorageHelper, Base64} from '../shared/helpers';
import {SafeNamesPipe, MDFilterPipe} from '../shared/pipes';

declare var StringView: any;

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
    selectedFile: IContents;
    selectedBranch: IBranch = {
        name: "master"
    };
    selectedFilePath = "Readme.md";
    files: Observable<IContents[]>;
    branches: Observable<IBranch[]>;



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
        this.selectedFile = item; 
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

    onPushButtonClicked() {
        this._wordService.getMarkdown()
            .then((md) => {
                var mdView = new StringView(md, "UTF-8");
                var b64md = mdView.toBase64();
                b64md = b64md.replace(/(?:\r\n|\r|\n)/g, '');

                var body = {
                    message: "Initial commit",
                    content: b64md,
                    branch: this.selectedBranch.name,
                    sha: this.selectedFile.sha,
                    committer: {
                        name: this._githubService.profile.user.name,
                        email: 'umas@microsoft.com'
                    }
                };

                return this._githubService.updateFile(this.selectedOrg, this.selectedRepoName, this.selectedFile.path, body)
                    .subscribe(response => {
                        if (Utils.isEmpty(response)) return;
                        console.log(response);
                    });
            });
    }


}