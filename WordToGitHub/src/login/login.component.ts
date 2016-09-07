import {Component} from '@angular/core';
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
        appInsights.trackEvent('login to github');
        appInsights.clearAuthenticatedUserContext();
        var start = performance.now();
        this._githubService.login()
            .then(profile => {
                var end = performance.now();
                appInsights.setAuthenticatedUserContext(profile.user.login);
                appInsights.trackMetric('login duration', (end - start) / 1000);                
                this._router.navigate(['']);
            })
            .catch(Utils.error);
    }
}