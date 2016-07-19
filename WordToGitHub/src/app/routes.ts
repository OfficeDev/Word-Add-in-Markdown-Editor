import {provideRouter, RouterConfig} from '@angular/router';
import {FileRoutes, HamburgerComponent, LoginComponent, RepoComponent} from "./components";

export const BaseRoutes: RouterConfig = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: RepoComponent
    },    
    {
        path: ':org',
        component: RepoComponent
    }
];

export const routes: RouterConfig = [
    ...BaseRoutes,
    ...FileRoutes
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];