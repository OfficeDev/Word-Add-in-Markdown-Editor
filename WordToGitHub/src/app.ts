import {bootstrap} from '@angular/platform-browser-dynamic';
import {ExceptionHandler, Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {HamburgerComponent, ToastComponent, MessageBarComponent} from "./components";
import {APP_ROUTER_PROVIDERS} from "./routes";
import {GithubService, AuthorizeService, WordService, FavoritesService, MediatorService, MarkdownService, NotificationService, AuthGuard} from "./shared/services";
import {Utils, ExceptionHelper, RequestHelper} from "./shared/helpers";

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

export class AppComponent {
    static bootstrap() {
        if (window.location.href.indexOf('code') !== -1 || window.location.href.indexOf('error') !== -1) {
            new AuthorizeService().getToken();
        }
        else {
            Office.initialize = AppComponent._initialize;
        }
    }

    private static _initialize(reason?: Office.InitializationReason) {
        bootstrap(AppComponent, [
            HTTP_PROVIDERS, APP_ROUTER_PROVIDERS,
            { provide: ExceptionHandler, useClass: ExceptionHelper }, RequestHelper,
            { provide: LocationStrategy, useClass: HashLocationStrategy },
            NotificationService, GithubService, WordService, MarkdownService, MediatorService, FavoritesService, AuthGuard
        ]);
    }
}

AppComponent.bootstrap();