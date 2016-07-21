import {provideRouter, RouterConfig} from '@angular/router';
import {FileRoutes, HamburgerComponent, LoginComponent, RepoComponent} from "./components";
import {AuthGuard} from './shared/services';

export const BaseRoutes: RouterConfig = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: RepoComponent,
        canActivate: [AuthGuard]
    },    
    {
        path: ':org',
        component: RepoComponent,
        canActivate: [AuthGuard]
    }
];

export const routes: RouterConfig = [
    ...BaseRoutes,
    ...FileRoutes
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];