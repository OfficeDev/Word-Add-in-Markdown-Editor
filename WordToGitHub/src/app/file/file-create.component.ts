import {Component, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {Router, OnActivate, RouteSegment} from '@angular/router';
import {Path, Utils} from '../shared/helpers';
import {GithubService, WordService, ICommit} from '../shared/services';

declare var StringView: any;
let view = 'file-create';

export interface ITemplate {
    path: string,
    title: string,
    description: string
}

@Component({
    selector: view,
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')]
})

export class FileCreateComponent implements OnActivate, OnDestroy {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    selectedFile: string;

    templates: ITemplate[];    
    selectedTemplate: ITemplate;
    templateContent: string;
    
    selectedFolder: string;
    subscriptions: Subscription[];

    constructor(
        private _router: Router,
        private _githubService: GithubService,
        private _wordService: WordService
    ) {
        this.templates = [
            {
                path: '',
                title: 'Empty',
                description: 'Creates a new empty markdown file',
            },
            {
                path: '',
                title: 'Basic',
                description: 'Creates a basic markdown file',
            },
            {
                path: '',
                title: 'Readme',
                description: 'Creates a new readme markdown file with all the required sections',
            },
            {
                path: '',
                title: 'API Documentation',
                description: 'Creates a new api documentation markdown file with all the required sections',
            },
            {
                path: '',
                title: 'License',
                description: 'Creates a new license markdown file',
            },
            {
                path: '',
                title: 'Contribution',
                description: 'Creates a new contribution markdown file',
            }
        ];

        this.selectedTemplate = _.first(this.templates);
     }

    ngOnDestroy() {
        _.each(this.subscriptions, subscription => subscription.unsubscribe());
    }

    routerOnActivate(current: RouteSegment) {
        this.selectedRepoName = current.getParam('repo');
        this.selectedOrg = current.getParam('org');
        this.selectedBranch = current.getParam('branch');
        this.selectedPath = decodeURIComponent(current.getParam('path'));
    }

    createFile() {
        var path;

        if (Utils.isNull(this.selectedPath)) {
            path = this.selectedFile;
        }
        else {
            path = this.selectedPath + '/' + (this.selectedFolder ? this.selectedFolder + '/' : '') + this.selectedFile;
        }

        var body = {
            message: 'Creating ' + this.selectedFile,
            content: this.templateContent || '',
            branch: this.selectedBranch
        };

        return this._githubService.createFile(this.selectedOrg, this.selectedRepoName, path, body)
            .subscribe(response => {
                this._wordService.insertTemplate(this.selectedTemplate.path);
                this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch, 'detail', encodeURIComponent(path)]);
            });
    }
}