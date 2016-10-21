import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { IBreadcrumb } from '../../services';
import { Utilities } from '../../helpers';
import { BaseComponent } from '../../components';
import 'breadcrumb.component.scss';

@Component({
    selector: 'breadcrumb',
    templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent extends BaseComponent implements OnDestroy {
    private _breadcrumbs: IBreadcrumb[] = [];
    private _max: number;

    isOverflown: boolean;
    breadcrumbs: IBreadcrumb[];
    overflownBreadcrumbs: IBreadcrumb[];

    constructor(private _router: Router) {
        super();
    }

    @Input()
    set max(value: number) {
        this._max = value <= 0 ? 4 : value;
    };

    get max(): number {
        return this._max;
    }

    click(breadcrumb: IBreadcrumb) {
        if (Utilities.isNull(breadcrumb.href)) return;
        this._router.navigate(breadcrumb.href as string[]);
    }

    ngOnInit() {
        this._generateFromUrl(this._router.url);
        this._recompute();

        var subscription = this._router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this._generateFromUrl(this._router.url);
                this._recompute();
            }
        });

        this.markDispose(subscription);
    }

    private _generateFromUrl(url: string) {
        this._breadcrumbs = [];
        var routerLinkArray = url.split('/');
        var path = _.last(routerLinkArray);
        var detail = path === 'detail';
        path = detail ? routerLinkArray[4] : path;

        var href = _.rest(_.first(routerLinkArray, 4)) as string[];
        var branch = _.last(href);

        if (!Utilities.isNull(branch)) {
            this._breadcrumbs.push({
                key: 0,
                text: branch,
                href: href
            });
        }

        if (!Utilities.isNull(path) && path !== branch) {
            var decodedSegments = decodeURIComponent(path as string).split('/');
            _.each(decodedSegments, (segment, i) => {
                var pathToSegment = encodeURIComponent(_.first(decodedSegments, i + 1).join('/'));
                this._breadcrumbs.push({
                    key: i + 1,
                    text: segment,
                    href: [...href, pathToSegment]
                });
            });
        }

        if (detail) {
            var file = _.last(this._breadcrumbs);
            file.href = null;
        }
    }

    private _recompute() {
        if (Utilities.isEmpty(this._breadcrumbs)) {
            this.breadcrumbs = null;
            this.overflownBreadcrumbs = null;
            return;
        };

        if (this._breadcrumbs.length > this.max) {
            this.overflownBreadcrumbs = _.first(this._breadcrumbs, this._breadcrumbs.length - this.max);
            this.breadcrumbs = _.last(this._breadcrumbs, this.max);
        }
        else {
            this.breadcrumbs = this._breadcrumbs;
            this.overflownBreadcrumbs = null;
        }
    }
}