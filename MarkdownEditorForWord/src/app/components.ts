import { AppComponent } from './app.component';
import { LoginComponent } from './login';
import { RepoComponent } from './repo';
import * as File from './file';
import * as Shared from './shared/components';

export { AppComponent, LoginComponent, RepoComponent, File, Shared };
export const COMPONENTS = [
    LoginComponent,
    RepoComponent,
    File.FileListComponent,
    File.FileTreeComponent,
    File.FileDetailComponent,
    File.FileCreateComponent,
    Shared.AsyncViewComponent,
    Shared.BreadcrumbComponent,
    Shared.HamburgerComponent,
    Shared.MessageBarComponent,
    Shared.ToastComponent,
    AppComponent
]