﻿import {Component, OnInit} from '@angular/core';
import {GithubService} from '../shared/services/github.service';
import {Router} from '@angular/router';
import {Path} from '../shared/helpers/utilities';


let view = 'login';
@Component({
    templateUrl: Path.template(view),
    styleUrls: [Path.style(view)]
})

export class LoginComponent implements OnInit {
    constructor(
        private _githubService: GithubService,
        private _router: Router
    ) { }

    login() {
        this._githubService.logout("@user");
        this._githubService.login()
            .subscribe(
            token => {
                this._router.navigate(['/repos']);
            },
            error => { console.log(error); }
            );
    }

    ngOnInit() {
    }
}