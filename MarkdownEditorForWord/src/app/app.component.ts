import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Utilities } from './shared/helpers';

@Component({
    selector: 'app',
    template:
    `<hamburger></hamburger>
    <main class="app__main ms-font-m ms-fontColor-neutralPrimary">
        <message-bar></message-bar>
        <router-outlet></router-outlet>
        <toast></toast>
    </main>
    <footer class="app-container__footer"></footer>`
})

export class AppComponent {
    constructor(router: Router) {
        router.events.subscribe(next => {
            if (next instanceof NavigationStart) {
                if (Utilities.isEmpty(next.url)) return;
                var name = next.url.split('/')[1];
                appInsights.startTrackPage(name);
            }
            else if (next instanceof NavigationEnd) {
                if (Utilities.isEmpty(next.url)) return;
                var name = next.url.split('/')[1];
                appInsights.stopTrackPage(
                    name,
                    next.url
                );
            }
        });
    }
}