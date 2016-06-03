import {Component} from '@angular/core';
import {GithubService, IRepository} from '../shared/services/github.service';
import {Router} from '@angular/router';
import {Path} from '../shared/helpers/utilities';

let view = 'login';
@Component({
    templateUrl: Path.template(view),
    styleUrls: [Path.style(view)]
})

export class LoginComponent {

    constructor(
        private _githubService: GithubService,
        private _router: Router
    ) {
    }

    login() {
        this._githubService.login()
            .then(token => this._router.navigate(['/repos']));
    }       
}