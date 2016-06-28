import {Component} from '@angular/core';
import {GithubService, IRepository} from '../shared/services';
import {Router} from '@angular/router';
import {Path, Utils} from '../shared/helpers';

let view = 'login';
@Component({
    selector: view,
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
            .then(profile => {
                this._router.navigate(['/profile']);
            })
            .catch(Utils.error);
    }
}