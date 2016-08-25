import {Injectable} from '@angular/core';
import {Utils} from '../helpers';
import {Observable, Observer, Subscription} from 'rxjs/Rx';
import {MediatorService, IEventChannel} from '../../shared/services';
declare var AppInsights: ApplicationInsights;

@Injectable()
export class ApplicationInsightsService {
    constructor() {
        AppInsights.setup('');
    }
}