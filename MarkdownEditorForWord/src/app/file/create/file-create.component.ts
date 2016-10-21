import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilities } from '../../shared/helpers';
import { GithubService, WordService, NotificationService, ICommit } from '../../shared/services';
import { BaseComponent } from '../../shared/components';
import './file-create.component.scss';
declare var StringView: any;

interface ITemplate {
    id: number,
    path: string,
    title: string,
    description: string
}

@Component({
    selector: 'file-create',
    templateUrl: 'file-create.component.html'
})
export class FileCreateComponent extends BaseComponent implements OnInit, OnDestroy {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    selectedFile: string;

    templates: ITemplate[];
    selectedTemplate: ITemplate;

    newFolder: boolean;
    selectedFolder: string;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _githubService: GithubService,
        private _wordService: WordService,
        private _notificationService: NotificationService
    ) {
        super();

        this.templates = [
            {
                id: 0,
                path: null,
                title: 'Empty',
                description: 'Creates a new empty markdown file',
            },
            {
                id: 2,
                path: 'readme',
                title: 'Readme',
                description: 'Creates a new readme markdown file with all the required sections',
            },
            {
                id: 3,
                path: 'object-definition',
                title: 'API Documentation',
                description: 'Creates a new api documentation markdown file with all the required sections',
            },
            {
                id: 4,
                path: 'mit-license',
                title: 'License',
                description: 'Creates a new MIT license markdown file',
            },
            {
                id: 5,
                path: 'contributing',
                title: 'Contribution',
                description: 'Creates a new contribution markdown file',
            }
        ];

        this.selectedTemplate = _.first(this.templates);
    }

    ngOnInit() {
        var subscription = this._route.params.subscribe(params => {
            this.selectedRepoName = params['repo'];
            this.selectedOrg = params['org'];
            this.selectedBranch = params['branch'];
            this.selectedPath = decodeURIComponent(params['path']);
            this.selectedPath = this.selectedPath === '#!/' ? null : this.selectedPath;
        });

        this.markDispose(subscription);
    }

    back = () => Utilities.isNull(this.selectedPath) ?
        this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch]) :
        this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath]);

    create() {
        if (Utilities.isEmpty(this.selectedFile)) return null;

        var path = '';
        if (!Utilities.isEmpty(this.selectedPath)) path += this.selectedPath + '/';
        path += (this.newFolder && !Utilities.isEmpty(this.selectedFolder) ? this.selectedFolder.replace(/\s/g, '-') + '/' : '') + this.selectedFile.replace(/\s/g, '-') + '.md';

        this._githubService.getFileData(this.selectedTemplate.path).toPromise()
            .then(templateContent => {
                var base64Content = new StringView(templateContent, "UTF-8").toBase64().replace(/(?:\r\n|\r|\n)/g, '');
                this._wordService.insertTemplate(templateContent, `https://raw.githubusercontent.com/${this.selectedOrg}/${this.selectedRepoName}/${this.selectedBranch}`);
                return {
                    message: 'Creating ' + this.selectedFile + '.md',
                    content: base64Content,
                    branch: this.selectedBranch
                };
            })
            .then(body => this._githubService.createFile(this.selectedOrg, this.selectedRepoName, path, body).toPromise())
            .then(response => this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch, encodeURIComponent(path), 'detail']))
            .then(() => this._notificationService.toast(`${this.selectedFile} was created successfully`, 'File created'))
            .catch(exception => this._notificationService.error(exception));
    }
}