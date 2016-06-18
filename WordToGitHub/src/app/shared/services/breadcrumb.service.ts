import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Utils} from '../helpers';

export interface IBreadcrumb {
    text: string;
    key: number;
    href?: string;
}

@Injectable()
export class BreadcrumbService {
    static id: number = 1;
    private breadcrumbSource = new Subject<IBreadcrumb>();

    breadcrumb$ = this.breadcrumbSource.asObservable();

    push(path: string) {
        var text = Utils.isNull(path) ? 'Root' : _.last(path.split('/'));
        this.breadcrumbSource.next(<IBreadcrumb>{
            key: BreadcrumbService.id++,
            text: text,
            href: path
        });
    }
}