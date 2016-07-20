import 'rxjs/Rx';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ExceptionHandler, Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';


import {HamburgerComponent} from "./components";
import {APP_ROUTER_PROVIDERS} from "./routes";
import {GithubService, WordService, FavoritesService, MediatorService, MarkdownService} from "./shared/services";
import {Utils, ExceptionHelper, RequestHelper} from "./shared/helpers";

function launch(reason?: Office.InitializationReason, inject?: boolean) {
    if (inject) {
        window.localStorage['Profile'] = '{"umasubra":{"user":{"login":"umasubra","id":9220027,"avatar_url":"https://avatars.githubusercontent.com/u/9220027?v=3","gravatar_id":"","url":"https://api.github.com/users/umasubra","html_url":"https://github.com/umasubra","followers_url":"https://api.github.com/users/umasubra/followers","following_url":"https://api.github.com/users/umasubra/following{/other_user}","gists_url":"https://api.github.com/users/umasubra/gists{/gist_id}","starred_url":"https://api.github.com/users/umasubra/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/umasubra/subscriptions","organizations_url":"https://api.github.com/users/umasubra/orgs","repos_url":"https://api.github.com/users/umasubra/repos","events_url":"https://api.github.com/users/umasubra/events{/privacy}","received_events_url":"https://api.github.com/users/umasubra/received_events","type":"User","site_admin":false,"name":"Uma Subramanian","company":null,"blog":null,"location":null,"email":null,"hireable":null,"bio":null,"public_repos":7,"public_gists":0,"followers":6,"following":0,"created_at":"2014-10-14T19:26:20Z","updated_at":"2016-06-27T22:10:17Z"},"orgs":[{"login":"OfficeDev","id":6789362,"url":"https://api.github.com/orgs/OfficeDev","repos_url":"https://api.github.com/orgs/OfficeDev/repos","events_url":"https://api.github.com/orgs/OfficeDev/events","hooks_url":"https://api.github.com/orgs/OfficeDev/hooks","issues_url":"https://api.github.com/orgs/OfficeDev/issues","members_url":"https://api.github.com/orgs/OfficeDev/members{/member}","public_members_url":"https://api.github.com/orgs/OfficeDev/public_members{/member}","avatar_url":"https://avatars.githubusercontent.com/u/6789362?v=3","description":""}],"token":{"access_token":"3e89c2d5f94ea0305711d23f46726ae81f5b1a68","scope":"repo","token_type":"bearer"}}}';
    }

    bootstrap(AppComponent, [
        HTTP_PROVIDERS, APP_ROUTER_PROVIDERS,
        { provide: ExceptionHandler, useClass: ExceptionHelper },RequestHelper,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        GithubService, WordService, MarkdownService, MediatorService, FavoritesService
    ]);
}

@Component({
    selector: 'app',
    template:
    `<div class="app">
        <hamburger></hamburger>
        <main class="app__main ms-font-m ms-fontColor-neutralPrimary">
            <router-outlet></router-outlet>
        </main>
        <footer class="app-container__footer"></footer>
     </div>`,
    directives: [HamburgerComponent, ROUTER_DIRECTIVES]
})

export class AppComponent { }

Utils.isWord ? Office.initialize = launch : launch(null, true);