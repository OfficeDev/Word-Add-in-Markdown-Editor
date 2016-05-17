import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, Router, RouteConfig} from '@angular/router-deprecated';
import {ListFilesComponent} from "../github/list-files.component";
import {FileDetailComponent} from "../github/file-detail.component";
import {ListRepositoriesComponent} from "../github/list-repositories.component";
import {WordService} from '../word/word.service';

@Component({
    selector: 'word-md-addin',
    templateUrl: 'www/app/home/home.component.html',
    styleUrls: ['www/app/home/home.component.css'],
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    {path: '/files', name: 'Files', component: ListFilesComponent },
    {path: '/repositories', name: 'Repositories', component: ListRepositoriesComponent},
    {path: '/files/', name: 'FileDetail', component: FileDetailComponent}
])

export class HomeComponent {
    constructor(private _wordService: WordService, private _router: Router) {    }

    onClick() {
        // this._router.navigate(['Repositories']);
        this._wordService.insertHtml();
    }
}