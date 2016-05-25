import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, Router, Routes} from '@angular/router';
import {FilesComponent} from "../github/files.component";
import {LoginComponent} from "../github/login.component";
import {FileDetailComponent} from "../github/file-detail.component";
import {RepositoriesComponent} from "../github/repositories.component";
import {WordService} from '../word/word.service';
import {OnInit} from '@angular/core';

@Component({
    selector: 'word-md-addin',
    templateUrl: './app/home/home.component.html',
    styleUrls: ['./app/home/home.component.css'],
    directives: [ROUTER_DIRECTIVES]
})

 @Routes([
    { path: '/login', component: LoginComponent },
    { path: '/repos', component: RepositoriesComponent },
    //{ path: '/repositories/:index/files', component: FilesComponent },
    //{ path: '/repositories/:index/files/:fileindex', component: FileDetailComponent }
])

export class HomeComponent implements OnInit {

    constructor(private _router: Router) { }

    ngOnInit(): any {
        this._router.navigate(['/login']);
    }


}