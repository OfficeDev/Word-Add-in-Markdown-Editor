import { bootstrap } from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_PROVIDERS} from '@angular/router';

import {HomeComponent} from "./home/home.component";
import {GithubService} from "./github/github.service";
import {WordService} from "./word/word.service";
import {MarkdownService} from "./markdown/markdown.service";

//Office.initialize = (reason) => {
    console.log('Office is initialized');
    bootstrap(HomeComponent, [HTTP_PROVIDERS, [ROUTER_PROVIDERS], GithubService, MarkdownService, WordService]);
//};
