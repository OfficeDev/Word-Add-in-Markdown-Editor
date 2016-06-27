import {Component, AfterViewInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {OnActivate, Router, RouteSegment, RouteTree} from '@angular/router';
import {GithubService, BreadcrumbService, IBreadcrumb, IContents, WordService} from '../shared/services';
import {Path, Utils, StorageHelper} from '../shared/helpers';
import {SafeNamesPipe, MDFilterPipe} from '../shared/pipes';

let view = 'file-tree';

@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')],
    pipes: [SafeNamesPipe, MDFilterPipe]
})

export class FileTreeComponent implements OnActivate, AfterViewInit {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: string;
    selectedPath: string;
    files: Observable<IContents[]>;


    constructor(
        private _githubService: GithubService,
        private _breadcrumbService: BreadcrumbService,
        private _wordService: WordService,
        private _router: Router
    ) {
    }

    select(item: IContents) {
        if (item.type === 'dir') {
            this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch, 'tree', encodeURIComponent(item.path)]);
        }
        else {
            this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch, 'detail', encodeURIComponent(item.path)]);
        }
    }

    createFile() {
        var path;
        var fileName = "TestFileFromCreate.md";
        var templateType = 'Code sample readme';

        if (Utils.isNull(this.selectedPath)) {
            path = fileName;
        }
        else {
            path = this.selectedPath + "/" + fileName;
        }

        var body = {
            message: "Initial commit",
            content: "",
            branch: this.selectedBranch,
            committer: {
                name: this._githubService.profile.user.name,
                email: this._githubService.profile.user.email || ''
            }
        };
        return this._githubService.createFile(this.selectedOrg, this.selectedRepoName, path, body)
            .subscribe(response => {
                this._wordService.insertTemplate(templateType);
                this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch, 'detail', encodeURIComponent(path)]);
                if (Utils.isEmpty(response)) return;
                console.log(response);
            });

    }

    routerOnActivate(current: RouteSegment, previous: RouteSegment, tree: RouteTree) {
        var parent = tree.parent(current);
        this.selectedRepoName = parent.getParam('repo');
        this.selectedOrg = parent.getParam('org');
        this.selectedBranch = parent.getParam('branch');
        this.selectedPath = current.getParam('path') === "null" ? null : current.getParam('path');
    }

    ngAfterViewInit() {
        if (!Utils.isNull(this.selectedPath)) { this.selectedPath = decodeURIComponent(this.selectedPath); }
        this._breadcrumbService.push(this.selectedPath);

        this.files = this._githubService.files(this.selectedOrg, this.selectedRepoName, this.selectedBranch, this.selectedPath);
    }
}