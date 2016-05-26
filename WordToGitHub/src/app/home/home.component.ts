import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, Routes} from '@angular/router';
import {Path} from '../shared/helpers/utilities';

import {RepoListComponent} from "../repo-list/repo-list.component";
import {RepoDetailComponent} from "../repo-detail/repo-detail.component";
import {FileDetailComponent} from "../file-detail/file-detail.component";
import {LoginComponent} from "../login/login.component";

let view = 'home';
@Component({
    selector: 'word-to-github',
    templateUrl: Path.template(view),
    styleUrls: [Path.style(view)],
    directives: [ROUTER_DIRECTIVES]
})

@Routes([
    {
        path: '/login',
        component: LoginComponent
    },
    {
        path: '/repos',
        component: RepoListComponent
    },
    {
        path: '/repo/:id',
        component: RepoDetailComponent
    },
    {
        path: '/file/:id',
        component: FileDetailComponent
    },
    {
        path: '*',
        component: LoginComponent
    }
])

export class HomeComponent implements OnInit {
    constructor(private _router: Router) { }

    ngOnInit() {
    }
}