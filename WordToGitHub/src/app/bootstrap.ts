import 'rxjs/Rx';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {provide, ExceptionHandler} from '@angular/core';
import {HTTP_PROVIDERS, RequestOptions} from '@angular/http';
import {ROUTER_PROVIDERS} from '@angular/router';

import {WordToGithubComponent} from "./word-to-github";
import {GithubService, HamburgerService} from "./shared/services";
import {Utils, ExceptionHelper, RequestHelper} from "./shared/helpers";

if (Utils.isWord) {
    Office.initialize = (reason) => {
        bootstrap(WordToGithubComponent, [
            HTTP_PROVIDERS,
            ROUTER_PROVIDERS,
            provide(LocationStrategy, { useClass: HashLocationStrategy }),
            provide(ExceptionHandler, { useClass: ExceptionHelper }),
            GithubService,
            HamburgerService,
            RequestHelper
        ]);
    };
}
else if (Utils.isWeb) {
    bootstrap(WordToGithubComponent, [
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        provide(LocationStrategy, { useClass: HashLocationStrategy }),
        provide(ExceptionHandler, { useClass: ExceptionHelper }),
        GithubService,
        HamburgerService,
        RequestHelper
    ]);
}