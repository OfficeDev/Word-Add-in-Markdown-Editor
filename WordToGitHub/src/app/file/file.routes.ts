import {provideRouter, RouterConfig} from '@angular/router';
import {FileListComponent, FileTreeComponent, FileDetailComponent, FileCreateComponent} from "../components";
import {AuthGuard} from '../shared/services';

export const FileRoutes: RouterConfig = [
    {
        path: ':org/:repo/:branch',
        component: FileListComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: FileTreeComponent
            },
            {
                path: ':path',
                component: FileTreeComponent
            },
            {
                path: ':path/detail',
                component: FileDetailComponent
            }                        
        ]
    },
    {
        path: ':org/:repo/:branch/:path/create',
        component: FileCreateComponent
    }
];