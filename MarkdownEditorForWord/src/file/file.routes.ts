import {provideRouter, RouterConfig} from '@angular/router';
import {FileListComponent, FileTreeComponent, FileDetailComponent, FileCreateComponent} from "../components";
import {AuthGuard} from '../shared/services';

export const FileRoutes: RouterConfig = [
    {
        path: ':org/:repo',
        component: FileListComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: ':branch',
                component: FileTreeComponent
            },
            {
                path: ':branch/:path',
                component: FileTreeComponent
            },
            {
                path: ':branch/:path/detail',
                component: FileDetailComponent
            },
            {
                path: ':branch/:path/detail',
                component: FileDetailComponent
            }                        
        ]
    },
    {
        path: ':org/:repo/:branch/create',
        component: FileCreateComponent
    },
    {
        path: ':org/:repo/:branch/:path/create',
        component: FileCreateComponent
    }
];