import { bootstrap } from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';

import HomeComponent from "./home/home.component";
import GithubService from "./github/github.service";
import MarkdownService from "./markdown/markdown.service";

try {
    Office.initialize = (reason) => {
        console.log('Office is initialized');
        bootstrap(HomeComponent, [HTTP_PROVIDERS, GithubService, MarkdownService]);
    };
}
catch (e) {
    bootstrap(HomeComponent, [HTTP_PROVIDERS, GithubService, MarkdownService]);
}