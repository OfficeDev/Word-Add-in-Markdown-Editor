import {Injectable, OnDestroy} from '@angular/core';
import {Utils} from '../helpers';
import {Observable, Observer, Subscription} from 'rxjs/Rx';
import {MediatorService, IEventChannel} from '../../shared/services';
declare var AppInsights: ApplicationInsights;
import { Router, NavigationStart } from '@angular/router';

@Injectable()
export class ApplicationInsightsService implements OnDestroy {
    private _subscription: Subscription;

    constructor(private _router: Router) {
        AppInsights.setup('b53b11c3-3b87-42fa-aa58-68f00b9e407b');

        this._subscription = this._router.events
            .map(event => event instanceof NavigationStart)
            .subscribe(() => {
                const activatedRoutePath = this._router.routerState.pathFromRoot;
                this.client.trackEvent("Navigating to " + activatedRoutePath);
            });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    get client() { return AppInsights.client; }
}