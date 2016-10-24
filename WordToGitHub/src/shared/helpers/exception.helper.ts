import {ExceptionHandler, Injectable} from '@angular/core';

@Injectable()
export class ExceptionHelper extends ExceptionHandler {
    call(exception: any, stackTrace?: any, reason?: string) {
        // track appinsights exceptions here.
        appInsights.trackException(exception);        
        console.group(exception.description || 'Handled Exception');
        console.error(exception);
        console.groupCollapsed('Stack Trace');
        console.error(stackTrace);
        console.groupEnd();
        console.groupEnd();
    }
}