import {provideRouter, RouterConfig} from '@angular/router';
import {FileListComponent, FileTreeComponent, FileDetailComponent, FileCreateComponent} from "../components";

export const FileRoutes: RouterConfig = [
    {
        path: 'files/:org/:repo/:branch',
        component: FileListComponent,
        children: [
            {
                path: 'tree/:path',
                component: FileTreeComponent
            },
            {
                path: 'detail/:path',
                component: FileDetailComponent
            },
            {
                path: '',
                redirectTo: 'tree/null',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'create/:org/:repo/:branch/:path',
        component: FileCreateComponent
    }
];