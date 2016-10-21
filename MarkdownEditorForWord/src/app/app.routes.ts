import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent, RepoComponent, File } from "./components";
import { AuthGuard } from './shared/services';

const BaseRoutes: Routes = [
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

export const BASE_ROUTES = RouterModule.forRoot(BaseRoutes, {
    useHash: true
});

export const FILE_ROUTES = File.FILE_ROUTES;