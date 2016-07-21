import {Subscription} from 'rxjs/Rx';
import {IEventChannel, ISubjectChannel} from '../shared/services';

export class BaseComponent {
    private _subscriptions: Subscription[] = [];

    protected markDispose(subscription: Subscription) {
        this._subscriptions.push(subscription);
    }

    ngOnDestroy() {
        _.each(this._subscriptions, subscription => {
            subscription.unsubscribe();
        });

        this._subscriptions = [];
    }
}