import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from '@angular/router';
import {Utils} from '../shared/helpers';
import {GithubService, WordService, ICommit} from '../shared/services';
//import {BaseComponent} from '../components';
declare var StringView: any;

interface ITemplate {
    path: string,
    title: string,
    description: string
}

@Component(Utils.component('file-create', null, 'file'))
export class FileCreateComponent implements OnInit {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    selectedFile: string;

    templates: ITemplate[];
    selectedTemplate: ITemplate;
    templateContent: string;

    selectedFolder: string;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _githubService: GithubService,
        private _wordService: WordService
    ) {
        //super();

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

    ngOnInit() {
        var subscription = this._route.params.subscribe(params => {
            this.selectedRepoName = params['repo'];
            this.selectedOrg = params['org'];
            this.selectedBranch = params['branch']
            this.selectedPath = decodeURIComponent(params['path']);
        });

        //this.markDispose(subscription);
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
                this._router.navigate([this.selectedOrg, this.selectedRepoName, this.selectedBranch, encodeURIComponent(path)], 'detail');
            });
    }
}