import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, Routes} from '@angular/router';

import {IToken} from './shared/services';
import {Utils, StorageHelper} from './shared/helpers';
import {RepoComponent, FileListComponent, FileDetailComponent, LoginComponent} from "./components";

@Component({
    selector: 'word-to-github',
    template:
    `<div class="wg-container">
        <main class="wg-container__main ms-font-m ms-fontColor-neutralPrimary">
            <router-outlet></router-outlet>
        </main>
        <footer class="wg-container__footer"></footer>
     </div>`,
    directives: [ROUTER_DIRECTIVES]
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
    private _storage: StorageHelper<IToken>;

    constructor(private _router: Router) { }

    ngOnInit() {
        var devMode = false;
        this._storage = new StorageHelper<IToken>("GitHubTokens");

        var tokens = _.values(this._storage.all());
        if (devMode || !Utils.isEmpty(tokens)) {
            this._router.navigate(['/repos']);
        }
        else {
            this._router.navigate(['/login']);
        }
    }
}