import 'rxjs/Rx';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide, ExceptionHandler} from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_PROVIDERS} from '@angular/router';

import {WordToGithubComponent} from "./word-to-github";
import {GithubService} from "./shared/services";
import {Utils, ExceptionHelper} from "./shared/helpers";

if (Utils.isWord) {
    Office.initialize = (reason) => {
        bootstrap(WordToGithubComponent, [
            provide(LocationStrategy, { useClass: HashLocationStrategy }),
            provide(ExceptionHandler, { useClass: ExceptionHelper }),
            HTTP_PROVIDERS,
            ROUTER_PROVIDERS,
            GithubService
        ]);
    };
}
else if (Utils.isWeb) {
    bootstrap(WordToGithubComponent, [
        provide(LocationStrategy, { useClass: HashLocationStrategy }),
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        GithubService
    ]);
}