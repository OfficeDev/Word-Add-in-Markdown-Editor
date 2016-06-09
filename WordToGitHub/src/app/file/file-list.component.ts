import {Component, OnInit} from '@angular/core';
import {OnActivate, Router, RouteSegment} from '@angular/router';
import {GithubService, MarkdownService, WordService, IContents, IBranch} from '../shared/services';
import {Path, StorageHelper} from '../shared/helpers';

let view = 'file-list';
@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')],
    providers: [MarkdownService, WordService]
})

export class FileListComponent implements OnActivate, OnInit {
    repo: string;
    selectedBranch: IBranch = {
        name: "bhargav-dev"
    };
    files: IContents[];
    favoriteFiles: IContents[];
    private _storage: StorageHelper<IContents>;
    branches: IBranch[];

    constructor(
        private _githubService: GithubService,
        private _wordService: WordService,
        private _router: Router) {
        this._storage = new StorageHelper<IContents>("FavoriteFiles");
    }

    ngOnInit(): any {
        this.favoriteFiles = _.values(this._storage.all());
    }

    onSelect(item: IContents) {
        this._wordService.insertHtml(item.name)
            .then(() => this._wordService.getHtml());
    }

    onPin(item: IContents) {
        this._storage.add(item.name.toString(), item);
        this.favoriteFiles = _.values(this._storage.all());
    }

    onUnpin(item: IContents) {
        this._storage.remove(item.name.toString());
        this.favoriteFiles = _.values(this._storage.all());
    }

    routerOnActivate(current: RouteSegment) {
        let id = +current.getParam('id');
        console.log('Showing data for repository', id);

        this._githubService.files()
            .then(files => { this.files = files; });


        this._githubService.branches()
            .then(branches => { this.branches = branches; });
    }
}