import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GithubService } from '../shared/services';
import { Utilities } from '../shared/helpers';
import 'login.component.scss';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    constructor(
        private _githubService: GithubService,
        private _router: Router
    ) {
    }

    login() {
        this._githubService.login()
            .then(profile => this._router.navigate(['']))
            .catch(Utilities.error);
    }
}