import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, Routes} from '@angular/router';

import {GithubService, IProfileMetadata} from './shared/services';
import {Utils} from './shared/helpers';

import {RepoComponent, HamburgerComponent, FileListComponent, FileDetailComponent, LoginComponent} from "./components";

@Component({
    selector: 'word-to-github',
    template:
    `<div class="wg-container">
        <hamburger></hamburger>
        <main class="wg-container__main ms-font-m ms-fontColor-neutralPrimary">
            <router-outlet></router-outlet>
        </main>
        <footer class="wg-container__footer"></footer>
     </div>`,
    directives: [HamburgerComponent, ROUTER_DIRECTIVES]
})

@Routes([
    {
        path: '/login',
        component: LoginComponent
    },
    {
        path: '/repos',
        component: RepoComponent
    },
    {
        path: '/repo/:name',
        component: FileListComponent
    },
    {
        path: '/file/:path',
        component: FileDetailComponent
    }
])

export class WordToGithubComponent implements OnInit {
    constructor(
        private _router: Router,
        private _githubService: GithubService
    ) { }

    ngOnInit() {

        if (!Utils.isNull(this._githubService.profile)) {
            this._router.navigate(['/repos']);
        }
        else {
            this._router.navigate(['/login']);
        }
    }
}