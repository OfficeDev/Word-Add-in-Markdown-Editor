import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from '@angular/router';
import {Utils} from '../shared/helpers';
import {SafeNamesPipe} from '../shared/pipes';
import {GithubService, WordService, ICommit} from '../shared/services';
import {BaseComponent} from '../components/base.component';
declare var StringView: any;

interface ITemplate {
    id: number,
    path: string,
    title: string,
    description: string
}

@Component({
    selector: 'file-create',
    templateUrl: './file-create.component.html',
    styleUrls: ['./file-create.component.scss'],
    pipes: [SafeNamesPipe]
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
        private _wordService: WordService
    ) {
        super();

        this.templates = [
            {
                id: 0,
                path: 'Code sample readme',
                title: 'Empty',
                description: 'Creates a new empty markdown file',
            },
            {
                id: 1,
                path: '',
                title: 'Basic',
                description: 'Creates a basic markdown file',
            },
            {
                id: 2,
                path: '',
                title: 'Readme',
                description: 'Creates a new readme markdown file with all the required sections',
            },
            {
                id: 3,
                path: 'API spec',
                title: 'API Documentation',
                description: 'Creates a new api documentation markdown file with all the required sections',
            },
            {
                id: 4,
                path: '',
                title: 'License',
                description: 'Creates a new license markdown file',
            },
            {
                id: 5,
                path: '',
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

    back() {
        if (Utils.isNull(this.selectedPath)) {
            this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch]);
        }
        else {
            this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath]);
        }
    }

    create() {
        var path;
        if (Utils.isEmpty(this.selectedFile)) {
            return null;
        }

        if (Utils.isEmpty(this.selectedPath)) {
            path = (this.newFolder && !Utils.isEmpty(this.selectedFolder) ? this.selectedFolder.replace(/\s/g, '-') + '/' : '') + this.selectedFile.replace(/\s/g, '-') + '.md';
        }
        else {
            path = this.selectedPath + '/' + (this.newFolder && !Utils.isEmpty(this.selectedFolder) ? this.selectedFolder.replace(/\s/g, '-') + '/' : '') + this.selectedFile.replace(/\s/g, '-') + '.md';
        }

        var sub = this._githubService.getFileData(this.selectedTemplate.path).subscribe(templateContent => {
            var mdView = new StringView(templateContent, "UTF-8");
            var b64md = mdView.toBase64();
            b64md = b64md.replace(/(?:\r\n|\r|\n)/g, '');

            var body = {
                message: 'Creating ' + this.selectedFile + '.md',
                content: b64md || '',
                branch: this.selectedBranch
            };

            this._wordService.insertTemplate(templateContent, this.selectedOrg, this.selectedRepoName, this.selectedBranch);
            var sub = this._githubService.createFile(this.selectedOrg, this.selectedRepoName, path, body)
                .subscribe(response => {
                    this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch, encodeURIComponent(path), 'detail']);
                });

            this.markDispose(sub);
        });

        this.markDispose(sub);
    }
}