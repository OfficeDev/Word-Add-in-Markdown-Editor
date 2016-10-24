import {bootstrap} from '@angular/platform-browser-dynamic';
import {ExceptionHandler, Component, OnDestroy} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_DIRECTIVES, Router, NavigationStart, NavigationEnd} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {HamburgerComponent, ToastComponent, MessageBarComponent} from "./components";
import {APP_ROUTER_PROVIDERS} from "./routes";
import {GithubService, AuthorizeService, WordService, FavoritesService, MediatorService, MarkdownService, NotificationService, AuthGuard} from "./shared/services";
import {Utils, ExceptionHelper, RequestHelper} from "./shared/helpers";
import 'rxjs/add/operator/filter';

require('./assets/styles/spinner.scss');
require('./assets/styles/globals.scss');

@Component({
    selector: 'app',
    template:
    `<hamburger></hamburger>
    <main class="app__main ms-font-m ms-fontColor-neutralPrimary">
        <message-bar></message-bar>        
        <router-outlet></router-outlet>
        <toast></toast>
    </main>
    <footer class="app-container__footer"></footer>`,
    directives: [HamburgerComponent, ROUTER_DIRECTIVES, MessageBarComponent, ToastComponent]
})

export class AppComponent implements OnDestroy {
    private subscription;

    constructor(router: Router) {
        this.subscription = router.events.subscribe(next => {
            if (next instanceof NavigationStart) {
                if (Utils.isEmpty(next.url)) return;
                var name = next.url.split('/')[1];
                appInsights.startTrackPage(name);
            }
            else if (next instanceof NavigationEnd) {
                if (Utils.isEmpty(next.url)) return;
                var name = next.url.split('/')[1];
                appInsights.stopTrackPage(
                    name,
                    next.url
                );
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    static boostrap() {
        Office.initialize = reason => {
            (window.location.href.indexOf('code') !== -1 || window.location.href.indexOf('error') !== -1) ?
                AuthorizeService.getToken() :
                AppComponent._loadAngular();
        }
    }

    private static _loadAngular(reason?: Office.InitializationReason) {
        bootstrap(AppComponent, [
            HTTP_PROVIDERS, APP_ROUTER_PROVIDERS,
            { provide: ExceptionHandler, useClass: ExceptionHelper }, RequestHelper,
            { provide: LocationStrategy, useClass: HashLocationStrategy },
            NotificationService, GithubService, WordService, MarkdownService, MediatorService, FavoritesService, AuthGuard
        ]);
    }
}

AppComponent.boostrap();