import {Injectable, EventEmitter, OnDestroy} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Utils} from '../helpers';
import {GithubService} from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _githubService: GithubService
    ) {
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!Utils.isNull(this._githubService.profile)) { return true; }        
        this._router.navigate(['/login']);   
        return false;
    }
}