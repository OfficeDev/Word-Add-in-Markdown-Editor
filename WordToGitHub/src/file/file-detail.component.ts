import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Router, ActivatedRoute} from '@angular/router';
import {Utils, NotificationHelper} from '../shared/helpers';
import {GithubService, WordService, ICommit} from '../shared/services';
import {BaseComponent} from '../components/base.component';
declare var StringView: any;

@Component({
    selector: 'file-detail',
    templateUrl: './file-detail.component.html',
    styleUrls: ['./file-detail.component.scss']
})
export class FileDetailComponent extends BaseComponent implements OnInit, OnDestroy {
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
        private _wordService: WordService,
        private _notificationHelper: NotificationHelper
    ) {
        super();
    }

    ngOnInit() {
        var subscription1 = this._router.routerState.parent(this._route).params.subscribe(params => {
            this.selectedRepoName = params['repo'];
            this.selectedOrg = params['org'];
        });

        var subscription2 = this._route.params.subscribe(params => {
            this.selectedBranch = params['branch'];
            this.selectedPath = Utils.isEmpty(params['path']) ? '' : decodeURIComponent(params['path']);
            this.selectedFile = _.last(this.selectedPath.split('/'));

            let subscription3 = this._githubService.file(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath)
                .subscribe(file => {
                    this._wordService.insertHtml(file);
                });

            this.markDispose(subscription3);
        });

        this.markDispose([subscription1, subscription2]);
    }

    push() {
        this._wordService.getBase64EncodedStringsOfImages()
            .then(images => {
                if (Utils.isEmpty(images)) { return this.updateFile(); }

                var arrayOfObservables = [];
                images.forEach(image => {
                    var subscription = this._githubService.getSha(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath)
                        .subscribe((file) => {
                            this.markDispose(subscription);

                            var body = {
                                message: "Image Upload: " + new Date().toISOString() + " from Word to GitHub Add-in",
                                content: image.base64ImageSrc.value,
                                branch: this.selectedBranch,
                                sha: file.sha
                            };

                            var observable = this._githubService.uploadImage(this.selectedOrg, this.selectedRepoName, image.hyperlink, body);
                            arrayOfObservables.push(observable);
                        });

                });

                var subscription = Observable.forkJoin(arrayOfObservables)
                    .subscribe(response => {
                        this.markDispose(subscription);
                        if (Utils.isEmpty(response)) return;
                        console.log(response);
                        this.updateFile();
                    });
            });
    }

    //styleAsCode() {
    //    this._wordService.styleAsCode();
    //}

    insertNumberedList() {
        this._wordService.insertNumberedList();
    }

    insertBulletedList() {
        this._wordService.insertBulletedList();
    }

    updateFile() {
        debugger;
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

                        console.log(body);

                        let sub3 = this._githubService.updateFile(this.selectedOrg, this.selectedRepoName, this.selectedPath, body)
                            .subscribe(response => {
                                this.markDispose(sub3);
                                this._notificationHelper.notify('Updated file successfully', 'Success');
                                this._notificationHelper.showToast('Updated file successfully');
                            },
                            error => this._notificationHelper.notify(JSON.stringify(error), 'Error')
                            );
                    }, error => console.error.bind(console));
            });

        this.markDispose(subscription);
    }
}