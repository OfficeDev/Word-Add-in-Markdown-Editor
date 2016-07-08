import {provideRouter, RouterConfig} from '@angular/router';
import {RepoComponent, HamburgerComponent, FileListComponent, FileCreateComponent, LoginComponent} from "./components";

export const routes: RouterConfig = [
    {
        path: 'profile',
        component: HamburgerComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'repos/:org',
        component: RepoComponent
    },
    {
        path: 'files/:org/:repo/:branch',
        component: FileListComponent
    },
    {
        path: 'create/:org/:repo/:branch/:path',
        component: FileCreateComponent
    }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];