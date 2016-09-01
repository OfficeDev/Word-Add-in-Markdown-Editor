import {ExceptionHandler, Injectable} from '@angular/core';
import {ApplicationInsightsService} from '../services';

@Injectable()
export class ExceptionHelper extends ExceptionHandler {
    constructor(private appInsights: ApplicationInsightsService, _logger: any, _rethrowExceptions?: boolean) {
        super(_logger, _rethrowExceptions);
    }

    call(exception: any, stackTrace?: any, reason?: string) {
        // track appinsights exceptions here.
        this.appInsights.client.trackException(exception);
        this.appInsights.client.trackTrace(exception);
        console.group(exception.description || 'Handled Exception');
        console.error(exception);
        console.groupCollapsed('Stack Trace');
        console.error(stackTrace);
        console.groupEnd();
        console.groupEnd();
    }
}