import {Component, OnInit} from '@angular/core';
import {OnActivate, Router, RouteSegment} from '@angular/router';
import {Path} from '../shared/helpers/utilities';
import {GithubService, IFile, IBranch} from '../shared/services/github.service';
import {StorageHelper} from '../shared/helpers/storage.helper';
import {MarkdownService} from '../shared/services/markdown.service';
import {WordService} from '../shared/services/word.service';

let view = 'file-list';
@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')],
    providers: [MarkdownService, WordService]
})

export class FileListComponent implements OnActivate, OnInit {
    repo: string;
    selectedBranch: IBranch = <IBranch>{
        id: 2,
        name: "bhargav-dev"
    };
    files: IFile[];
    favoriteFiles: IFile[];
    private _storage: StorageHelper<IFile>;
    branches: IBranch[];

    constructor(
        private _githubService: GithubService,
        private _wordService: WordService,
        private _router: Router) {
        this._storage = new StorageHelper<IFile>("FavoriteFiles");
    }

    ngOnInit(): any {
        this.favoriteFiles = _.values(this._storage.all());
    }

    onSelect(item: IFile) {
        //this._wordService.insertHtml(item.name)
        //    .then(() => this._wordService.getHtml());
    }

    onPin(item: IFile) {
        this._storage.add(item.id.toString(), item);
        this.favoriteFiles = _.values(this._storage.all());
    }

    onUnpin(item: IFile) {
        this._storage.remove(item.id.toString());
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