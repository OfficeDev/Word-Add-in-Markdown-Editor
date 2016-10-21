import { provideRoutes, RouterModule, Routes } from '@angular/router';
import { FileCreateComponent } from './create/file-create.component';
import { FileDetailComponent } from './detail/file-detail.component';
import { FileListComponent } from './list/file-list.component';
import { FileTreeComponent } from './tree/file-tree.component';
import { AuthGuard } from '../shared/services';

const FileRoutes: Routes = [
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

export const FILE_ROUTES = RouterModule.forChild(FileRoutes);
