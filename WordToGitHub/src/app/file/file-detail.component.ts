import {Component} from '@angular/core';
import {Router, RouteTree, OnActivate, RouteSegment} from '@angular/router';
import {Path, Utils} from '../shared/helpers';
import {GithubService, WordService} from '../shared/services';

declare var StringView: any;
let view = 'file-detail';
@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')]
})

export class FileDetailComponent implements OnActivate {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;

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
        this._githubService.file(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath).subscribe(file => {
            this._wordService.insertHtml(file);
        });
    }

    push() {
        this._githubService.getSha(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath)
            .subscribe((file) => {
                this._wordService.getMarkdown()
                    .then((md) => {
                        var mdView = new StringView(md, "UTF-8");
                        var b64md = mdView.toBase64();
                        b64md = b64md.replace(/(?:\r\n|\r|\n)/g, '');

                        var body = {
                            message: "Update: " + new Date().toISOString() + " from Word to GitHub Add-in",
                            content: b64md,
                            branch: this.selectedBranch,
                            sha: file.sha,
                            committer: {
                                name: this._githubService.profile.user.name,
                                email: this._githubService.profile.user.email || ''
                            }
                        };

                        return this._githubService.updateFile(this.selectedOrg, this.selectedRepoName, this.selectedPath, body)
                            .subscribe(response => {
                                if (Utils.isEmpty(response)) return;
                                console.log(response);
                            });
                    });
            });
    }
}