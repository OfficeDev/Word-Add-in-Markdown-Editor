import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Router, ActivatedRoute} from '@angular/router';
import {Utils} from '../shared/helpers';
import {GithubService, WordService, NotificationService, ICommit, MessageType} from '../shared/services';
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
    viewLink: string;

    private _file: any;
    private _sha: string;
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
        var subscription1 = this._router.routerState.parent(this._route).params.subscribe(params => {
            this.selectedRepoName = params['repo'];
            this.selectedOrg = params['org'];
        });

        var subscription2 = this._route.params.subscribe(params => {
            this.selectedBranch = params['branch'];
            this.selectedPath = Utils.isEmpty(params['path']) ? '' : decodeURIComponent(params['path']);
            this.selectedFile = _.last(this.selectedPath.split('/'));
            this.viewLink = `https://github.com/${this.selectedOrg}/${this.selectedRepoName}/blob/${this.selectedBranch}/${this.selectedPath}`;
            this.pull().catch(error => this._notificationService.message(JSON.stringify(error), MessageType.Error));
        });

        this.markDispose([subscription1, subscription2]);
    }

    push() {
        this._wordService.getBase64EncodedStringsOfImages()
            .then(images => {
                if (Utils.isEmpty(images)) { return this.updateFile(); }
                var promises = images.map(image => {
                    var body = {
                        message: "Image Upload: " + new Date().toISOString() + " from Word to GitHub Add-in",
                        content: image.base64ImageSrc.value,
                        branch: this.selectedBranch
                    };

                    return this._githubService.uploadImage(this.selectedOrg, this.selectedRepoName, image.hyperlink, body).toPromise();
                });

                Promise.all(promises).then(response => this.updateFile());
            });
    }

    pull() {
        var promises = [
            this._githubService.getSha(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath).toPromise(),
            this._githubService.file(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath).toPromise()
        ];

        return Promise.all(promises)
            .then(results => {
                var sha = results[0] && (results[0] as any).sha;
                this._file = results[1];
                if (!this._sha) this._sha = sha;
                if (this._sha === sha) {
                    this._wordService.insertHtml(this._file);
                    return this._file;
                }
                else {
                    throw 'Merge conflit!';
                }
            });
    }

    insertNumberedList() {
        this._wordService.insertNumberedList();
    }

    insertBulletedList() {
        this._wordService.insertBulletedList();
    }

    updateFile() {
        var promises = [
            this._githubService.getSha(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath).toPromise(),
            this._wordService.getMarkdown()
        ];        

        return Promise.all(promises)
            .then(results => {
                var file = results[0] as any;
                var md = results[1];

                if (Utils.isNull(md) || Utils.isNull(file)) throw 'Couldn\'t get the markdown of current document';
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
            .then(response => {
                console.log(response);                
                this._sha = response.content.sha;                
            })
            .catch(error => this._notificationService.message(JSON.stringify(error), MessageType.Error));
    }
}