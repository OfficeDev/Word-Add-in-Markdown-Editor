import {Component} from '@angular/core';
import {Repository} from '../shared/repository';
import {OnInit} from '@angular/core';
import {GithubService} from './github.service';
import {ROUTER_DIRECTIVES, Router, Routes} from '@angular/router';

@Component({
    selector: 'login-github',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [GithubService]
})

export class LoginComponent {

    constructor(private _githubService: GithubService, private _router: Router) { }

    onClick() {
        this._router.navigate(['/repos']);
    }
}