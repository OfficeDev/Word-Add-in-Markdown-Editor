import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, Routes} from '@angular/router';
import {Path} from '../shared/helpers/utilities';

import {FilesListComponent} from "../files-list/files-list.component";
import {FilesDetailComponent} from "../files-detail/files-detail.component";
import {LoginComponent} from "../login/login.component";
import {ReposComponent} from "../repos/repos.component";

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
        component: ReposComponent
    },
    {
        path: '/repos/:repoId/files',
        component: FilesListComponent
    },
    {
        path: '/repos/:repoId/files/:fileId',
        component: FilesDetailComponent
    },
    {
        path: '*',
        component: LoginComponent
    }
])

export class HomeComponent implements OnInit {
    constructor(private _router: Router) { }

    ngOnInit() { }
}