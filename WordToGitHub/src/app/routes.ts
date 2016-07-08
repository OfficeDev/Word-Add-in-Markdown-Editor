import {provideRouter, RouterConfig} from '@angular/router';
import {FileRoutes, HamburgerComponent, LoginComponent, RepoComponent} from "./components";

export const BaseRoutes: RouterConfig = [
    {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
    },
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
    }
];

export const routes: RouterConfig = [
    ...BaseRoutes,
    ...FileRoutes
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];