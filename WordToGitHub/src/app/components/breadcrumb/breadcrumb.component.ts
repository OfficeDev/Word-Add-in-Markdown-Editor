import {Component, EventEmitter, Input, Output, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {MediatorService, IBreadcrumb, ISubjectChannel} from '../../shared/services';
import {Utils} from '../../shared/helpers';
//import {BaseComponent} from '../../components';

@Component(Utils.component('breadcrumb', null, 'breadcrumb'))


export class BreadcrumbComponent {
    private _breadcrumbs: IBreadcrumb[] = [];
    private _max: number;

    channel: ISubjectChannel
    isOverflown: boolean;
    breadcrumbs: IBreadcrumb[];
    overflownBreadcrumbs: IBreadcrumb[];

    constructor(private _mediatorService: MediatorService) {
        //super();
        this.channel = _mediatorService.createSubjectChannel<IBreadcrumb>('breadcrumbs');
        //this.markDispose(this.channel);
    }

    @Output() navigate: EventEmitter<IBreadcrumb> = new EventEmitter<IBreadcrumb>();

    @Input()
    set max(value: number) {
        this._max = value <= 0 ? 4 : value;
    };

    get max(): number {
        return this._max;
    }

    click(breadcrumb: IBreadcrumb) {
        var index = _.findIndex(this._breadcrumbs, item => item.key === breadcrumb.key);

        if (index === -1) throw 'Breadcrumb path couldn\'t be found';

        if (index === this._breadcrumbs.length - 1) return;

        this._breadcrumbs = _.first(this._breadcrumbs, index);
        this._recompute();

        this.navigate.emit(breadcrumb);
    }

    ngOnInit() {
        var subscription = this.channel.source$.subscribe(breadcrumb => {
            this._breadcrumbs.push(breadcrumb);
            this._recompute();
        });

        //this.markDispose(subscription);
    }

    private _recompute() {
        if (Utils.isEmpty(this._breadcrumbs)) {
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