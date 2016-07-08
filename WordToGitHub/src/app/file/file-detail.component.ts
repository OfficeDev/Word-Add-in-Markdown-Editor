import {Component, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {Router, RouteTree, OnActivate, RouteSegment} from '@angular/router';
import {Path, Utils} from '../shared/helpers';
import {GithubService, WordService, ICommit} from '../shared/services';

declare var StringView: any;
let view = 'file-detail';
@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')]
})

export class FileDetailComponent implements OnActivate, OnDestroy {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    selectedFile: string;
    subscriptions: Subscription[];
    commits: Observable<ICommit[]>

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
        this.selectedFile = _.last(this.selectedPath.split('/'));

        var subscription = this._githubService.file(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath).subscribe(file => {
            this._wordService.insertHtml(file);
        });

        //this.commits = this._githubService.commits(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath);

        this.subscriptions.push(subscription);
    }

    push() {
        var subscription = Observable.fromPromise(this._wordService.getBase64EncodedStringsOfImages())
            .subscribe(base64Strings => {
                if (Utils.isEmpty(base64Strings) || Utils.isNull(base64Strings)) {
                    this.updateFile();
                }
                base64Strings.forEach(base64String => {
                    this._githubService.getSha(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath)
                        .subscribe((file) => {
                            var body = {
                                message: "Image Upload: " + new Date().toISOString() + " from Word to GitHub Add-in",
                                content: base64String.base64ImageSrc.value,
                                branch: this.selectedBranch,
                                sha: file.sha
                            };
                            return this._githubService.uploadImage(this.selectedOrg, this.selectedRepoName, base64String.hyperlink, body)
                                .subscribe(response => {
                                    if (Utils.isEmpty(response)) return;
                                    console.log(response);
                                    this.updateFile();
                                });
                        });

                });
            });

        this.subscriptions.push(subscription);
    }


    updateFile() {
             var subscription = this._githubService.getSha(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath)
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
                            sha: file.sha
                        };

                        return this._githubService.updateFile(this.selectedOrg, this.selectedRepoName, this.selectedPath, body)
                            .subscribe(response => {
                                if (Utils.isEmpty(response)) return;
                                console.log(response);
                            });
                    });
            });

        this.subscriptions.push(subscription);
    }
}