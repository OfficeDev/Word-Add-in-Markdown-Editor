import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, Router, Routes} from '@angular/router';
import {ListFilesComponent} from "../github/list-files.component";
import {FileDetailComponent} from "../github/file-detail.component";
import {ListRepositoriesComponent} from "../github/list-repositories.component";
import {WordService} from '../word/word.service';

@Component({
    selector: 'word-md-addin',
    templateUrl: './app/home/home.component.html',
    styleUrls: ['./app/home/home.component.css'],
    directives: [ROUTER_DIRECTIVES]
})

@Routes([
    { path: '/files', component: ListFilesComponent },
    { path: '/repositories', component: ListRepositoriesComponent },
    { path: '/files/:id', component: FileDetailComponent }
])

export class HomeComponent {
    constructor(private _wordService: WordService, private _router: Router) { }

    onClick() {
        this._wordService.insertHtml();
    }
}