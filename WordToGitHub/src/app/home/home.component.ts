import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, Routes} from '@angular/router';
import {Path, Utils} from '../shared/helpers/utilities';

import {IToken} from '../shared/services/github.service';
import {RepoListComponent} from "../repo-list/repo-list.component";
import {FileListComponent} from "../file-list/file-list.component";
import {FileDetailComponent} from "../file-detail/file-detail.component";
import {LoginComponent} from "../login/login.component";
import {StorageHelper} from '../shared/helpers/storage.helper';

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
        component: FileListComponent
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
    private _storage: StorageHelper<IToken>;

    constructor(private _router: Router) {
        this._storage = new StorageHelper<IToken>("GitHubTokens");
    }

    ngOnInit() {
        var tokens = _.values(this._storage.all());
        if (!Utils.isEmpty(tokens)) {
            this._router.navigate(['/repos']);
        }
        else {
            this._router.navigate(['/login']);
        }
    }
}