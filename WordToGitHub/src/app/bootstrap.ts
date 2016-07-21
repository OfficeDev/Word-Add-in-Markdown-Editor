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
        window.localStorage['Profile'] = '{"WrathOfZombies":{"user":{"login":"WrathOfZombies","id":3244360,"avatar_url":"https://avatars.githubusercontent.com/u/3244360?v=3","gravatar_id":"","url":"https://api.github.com/users/WrathOfZombies","html_url":"https://github.com/WrathOfZombies","followers_url":"https://api.github.com/users/WrathOfZombies/followers","following_url":"https://api.github.com/users/WrathOfZombies/following{/other_user}","gists_url":"https://api.github.com/users/WrathOfZombies/gists{/gist_id}","starred_url":"https://api.github.com/users/WrathOfZombies/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/WrathOfZombies/subscriptions","organizations_url":"https://api.github.com/users/WrathOfZombies/orgs","repos_url":"https://api.github.com/users/WrathOfZombies/repos","events_url":"https://api.github.com/users/WrathOfZombies/events{/privacy}","received_events_url":"https://api.github.com/users/WrathOfZombies/received_events","type":"User","site_admin":false,"name":"Bhargav Krishna","company":"Microsoft","blog":null,"location":"Redmond","email":"bhargav.krishna@outlook.com","hireable":null,"bio":"I work @Microsoft for the @OfficeDev MAX Team. I love web development and love tinkering otherwise you can find me in digital worlds slaying bosses.","public_repos":11,"public_gists":0,"followers":11,"following":4,"created_at":"2013-01-11T12:52:47Z","updated_at":"2016-06-24T21:11:15Z"},"orgs":[{"login":"Microsoft","id":6154722,"url":"https://api.github.com/orgs/Microsoft","repos_url":"https://api.github.com/orgs/Microsoft/repos","events_url":"https://api.github.com/orgs/Microsoft/events","hooks_url":"https://api.github.com/orgs/Microsoft/hooks","issues_url":"https://api.github.com/orgs/Microsoft/issues","members_url":"https://api.github.com/orgs/Microsoft/members{/member}","public_members_url":"https://api.github.com/orgs/Microsoft/public_members{/member}","avatar_url":"https://avatars.githubusercontent.com/u/6154722?v=3","description":"Open source, from Microsoft with love"},{"login":"OfficeDev","id":6789362,"url":"https://api.github.com/orgs/OfficeDev","repos_url":"https://api.github.com/orgs/OfficeDev/repos","events_url":"https://api.github.com/orgs/OfficeDev/events","hooks_url":"https://api.github.com/orgs/OfficeDev/hooks","issues_url":"https://api.github.com/orgs/OfficeDev/issues","members_url":"https://api.github.com/orgs/OfficeDev/members{/member}","public_members_url":"https://api.github.com/orgs/OfficeDev/public_members{/member}","avatar_url":"https://avatars.githubusercontent.com/u/6789362?v=3","description":""}],"token":{"access_token":"6407dd1f890332710bfa66e0f370c3de72bbf841","scope":"repo","token_type":"bearer"}}}';
    }

    bootstrap(AppComponent, [
        HTTP_PROVIDERS, APP_ROUTER_PROVIDERS,
        { provide: ExceptionHandler, useClass: ExceptionHelper }, RequestHelper,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        GithubService, WordService, MarkdownService, MediatorService, FavoritesService
    ]);
}

@Component({
    selector: 'app',
    template:
    `<hamburger></hamburger>
    <main class="app__main ms-font-m ms-fontColor-neutralPrimary">
        <router-outlet></router-outlet>
    </main>
    <footer class="app-container__footer"></footer>`,
    directives: [HamburgerComponent, ROUTER_DIRECTIVES]
})

export class AppComponent { }

Utils.isWord ? Office.initialize = launch : launch(null, true);