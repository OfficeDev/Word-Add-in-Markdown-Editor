import {OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {IEventChannel, ISubjectChannel} from '../shared/services';

export class BaseComponent implements OnInit, OnDestroy {
    private _subscriptions: any[];

    constructor() {
    }

    protected markDispose(subscription: Subscription | IEventChannel | ISubjectChannel) {
        this._subscriptions.push(subscription);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        _.each(this._subscriptions, subscription => {
            if (subscription instanceof Subscription) {
                subscription.unsubscribe();
            }
            else {
                if (_.has(subscription, 'dataSource')) {
                    (<ISubjectChannel>subscription).dataSource.unsubscribe();
                }
                else {
                    (<IEventChannel>subscription).event.unsubscribe();
                }
            }
        });
    }
}