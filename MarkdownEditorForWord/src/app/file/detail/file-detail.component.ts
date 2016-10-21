import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilities } from '../../shared/helpers';
import { GithubService, WordService, NotificationService, ICommit, IMessage, MessageAction, MessageType } from '../../shared/services';
import { BaseComponent } from '../../shared/components';
import 'file-detail.component.scss';

declare var StringView: any;
@Component({
    selector: 'file-detail',
    templateUrl: './file-detail.component.html'
})
export class FileDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    selectedFile: string;
    viewLink: string;

    private _file: any;
    private _sha: string;
    private _imageLink: string;
    commits: Observable<ICommit[]>

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _githubService: GithubService,
        private _wordService: WordService,
        private _notificationService: NotificationService
    ) {
        super();
    }

    ngOnInit() {
        var subscription1 = this._router.routerState.root.params.subscribe(params => {
            this.selectedRepoName = params['repo'];
            this.selectedOrg = params['org'];
        });

        var subscription2 = this._route.params.subscribe(params => {
            this.selectedBranch = params['branch'];
            this.selectedPath = Utilities.isEmpty(params['path']) ? '' : decodeURIComponent(params['path']);
            this.selectedFile = _.last(this.selectedPath.split('/'));
            this.viewLink = `https://github.com/${this.selectedOrg}/${this.selectedRepoName}/blob/${this.selectedBranch}/${this.selectedPath}`;
            this._imageLink = `https://raw.githubusercontent.com/${this.selectedOrg}/${this.selectedRepoName}/${this.selectedBranch}`;
            this._pull();
        });

        this.markDispose([subscription1, subscription2]);
    }

    push() {
        this._wordService.getBase64EncodedStringsOfImages(this._imageLink)
            .then(images => {
                if (Utilities.isEmpty(images)) { return this._updateFile(); }
                var promises = images.map(image => {
                    var body = {
                        message: "Image Upload: " + new Date().toISOString() + " from Word to GitHub Add-in",
                        content: image.base64ImageSrc.value,
                        branch: this.selectedBranch
                    };

                    return this._githubService.uploadImage(this.selectedOrg, this.selectedRepoName, image.hyperlink, body).toPromise();
                });

                promises.push(this._updateFile() as any);
                return Promise.all(promises);
            })
            .then(() => { this._notificationService.toast(`${this.selectedFile} was updated successfully`, 'File updated'); })
            .catch(error => this._notificationService.error(error));
    }

    pull() {
        var actions = new MessageAction('Yes', 'No');
        var subscription = actions.actionEvent.subscribe(result => {
            if (!result) return null;
            this._pull();
        });

        this._notificationService.message({
            message: "Are you sure?",
            type: MessageType.Info,
            action: actions
        });

        this.markDispose(subscription);
    }

    insertNumberedList() {
        this._wordService.insertNumberedList();
    }

    insertBulletedList() {
        this._wordService.insertBulletedList();
    }

    private _pull() {
        var promises = [
            this._githubService.getSha(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath).toPromise(),
            this._githubService.file(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath).toPromise()
        ] as any;

        return Promise.all(promises)
            .then(results => {
                var sha = results[0] && (results[0] as any).sha;
                this._file = results[1];
                if (!this._sha) this._sha = sha;
                if (this._sha === sha) {
                    this._wordService.insertHtml(this._file, this._imageLink);
                    return this._file;
                }
                else {
                    throw 'Merge conflit!';
                }
            })
            .catch(error => this._notificationService.error(error));
    }

    private _updateFile() {
        var promises = [
            this._githubService.getSha(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath).toPromise(),
            this._wordService.getMarkdown(this._imageLink)
        ];

        return Promise.all(promises)
            .then(results => {
                var file = results[0] as any;
                var md = results[1];

                if (Utilities.isNull(md) || Utilities.isNull(file)) throw 'Couldn\'t get the markdown of current document';
                if (this._sha !== file.sha) throw 'We noticed a merge conflict!';

                var base64Data = new StringView(md, "UTF-8").toBase64().replace(/(?:\r\n|\r|\n)/g, '');
                return {
                    message: "Update: " + new Date().toISOString() + " from Word to GitHub Add-in",
                    content: base64Data,
                    branch: this.selectedBranch,
                    sha: file.sha
                };
            })
            .then(body => this._githubService.updateFile(this.selectedOrg, this.selectedRepoName, this.selectedPath, body).toPromise())
            .then(response => this._sha = response.content.sha)
            .catch(error => this._notificationService.error(error));
    }
}