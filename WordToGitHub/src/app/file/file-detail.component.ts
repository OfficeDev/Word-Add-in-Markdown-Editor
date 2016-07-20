import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Router, ActivatedRoute} from '@angular/router';
import {Utils} from '../shared/helpers';
import {GithubService, WordService, ICommit} from '../shared/services';
//import {BaseComponent} from '../components';
declare var StringView: any;

@Component(Utils.component('file-detail', null, 'file'))
export class FileDetailComponent implements OnInit {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    selectedFile: string;
    commits: Observable<ICommit[]>

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _githubService: GithubService,
        private _wordService: WordService
    ) {
        //super();
    }

    ngOnInit() {
        var subscription = this._router.routerState.parent(this._route).params.subscribe(params => {
            this.selectedRepoName = params['repo'];
            this.selectedOrg = params['org'];
            this.selectedBranch = params['branch']
        });

        var subscription2 = this._route.params.subscribe(params => {
            this.selectedPath = Utils.isEmpty(params['path']) ? '' : decodeURIComponent(params['path']);
            this.selectedFile = _.last(this.selectedPath.split('/'));

            let subscription = this._githubService.file(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath).subscribe(file => {
                this._wordService.insertHtml(file);
            });
        });

        //this.markDispose(subscription);
        //this.commits = this._githubService.commits(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath);
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

        //this.markDispose(subscription);
    }
}