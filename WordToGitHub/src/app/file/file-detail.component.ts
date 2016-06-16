import {Component} from '@angular/core';
import {Router, OnActivate, RouteSegment} from '@angular/router';
import {Path, Utils} from '../shared/helpers';
import {MarkdownService, WordService, GithubService} from '../shared/services';

let view = 'file-detail';
@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')],
    providers: [MarkdownService, WordService]
})

export class FileDetailComponent implements OnActivate {
    selectedOrg: string = "OfficeDev";
    selectedRepoName: string;
    selectedBranch: string;
    selectedFilePath: string;
    currentUserName: string;
    currentUserEmail: string;

    constructor(private _wordService: WordService, private _githubService: GithubService) { }

    routerOnActivate(current: RouteSegment) {
        let name = current.getParam('id');
        console.log('Loading data for file', name);

        this._wordService.insertHtml(name)
            .then(() => this._wordService.getHtml());
    }

    onPush() {

        this._wordService.getHtml()
            .then((html) => {
                var body = {
                            message: "Initial commit",
                            content: window.btoa(html),
                            branch: this.selectedBranch,
                            committer: {
                                name: this._githubService.profile.user.name,
                                email: this._githubService.profile.user.email
                            }
                };

               //this._githubService.updateFile(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedFilePath, JSON.stringify(body))
               //     .subscribe(response => {
               //         if (Utils.isEmpty(response)) return;
               //         console.log(response);
               //     });
        });       
    }

    onPull() {
    }

    onDiscard() {
    }
}