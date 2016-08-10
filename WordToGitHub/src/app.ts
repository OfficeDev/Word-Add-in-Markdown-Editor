import {bootstrap} from '@angular/platform-browser-dynamic';
import {ExceptionHandler, Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {HamburgerComponent, ToastComponent, MessageBarComponent} from "./components";
import {APP_ROUTER_PROVIDERS} from "./routes";
import {GithubService, AuthorizeService, WordService, FavoritesService, MediatorService, MarkdownService, AuthGuard} from "./shared/services";
import {Utils, ExceptionHelper, RequestHelper, NotificationHelper} from "./shared/helpers";

require('./assets/styles/spinner.scss');
require('./assets/styles/globals.scss');

@Component({
    selector: 'app',
    template:
    `<hamburger></hamburger>
    <main class="app__main ms-font-m ms-fontColor-neutralPrimary">
        <message-bar [message]="notification.banner?.message" [url]="notification.banner?.url" [action]="notification.banner?.action" [show]="notification.banner?.show" [type]="notification.banner?.type"></message-bar>        
        <router-outlet></router-outlet>
        <toast [message]="notification.toast?.message" [title]="notification.toast?.title" [show]="notification.toast?.show"></toast>
    </main>
    <footer class="app-container__footer"></footer>`,
    directives: [HamburgerComponent, ROUTER_DIRECTIVES, MessageBarComponent, ToastComponent]
})

export class AppComponent {
    constructor(public notification: NotificationHelper) {
    }

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
            { provide: ExceptionHandler, useClass: ExceptionHelper }, RequestHelper, NotificationHelper,
            { provide: LocationStrategy, useClass: HashLocationStrategy },
            GithubService, WordService, MarkdownService, MediatorService, FavoritesService, AuthGuard
        ]);
    }
}

AppComponent.bootstrap();