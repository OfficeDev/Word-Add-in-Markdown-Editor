import {OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Rx';


export class BaseComponent implements OnInit, OnDestroy {
    private _subscriptions: Subscription[];

    constructor() {
    }

    protected markDispose(subscription: Subscription) {
        this._subscriptions.push(subscription);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        _.each(this._subscriptions, subscription => subscription.unsubscribe());
    }
}