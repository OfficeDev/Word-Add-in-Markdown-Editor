﻿import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {GithubService} from '../shared/services';
import {Utils} from '../shared/helpers';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    constructor(
        private _githubService: GithubService,
        private _router: Router
    ) {
    }

    login() {
        this._githubService.login()
            .then(profile => { this._router.navigate(['']); })
            .catch(Utils.error);
    }
}