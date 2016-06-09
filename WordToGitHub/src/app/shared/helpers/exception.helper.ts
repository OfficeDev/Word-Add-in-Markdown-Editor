import {ExceptionHandler} from '@angular/core';

export class ExceptionHelper extends ExceptionHandler {
    call(exception: any, stackTrace?: any, reason?: string) {
        console.group(reason);
        console.error(exception);
        console.groupCollapsed('Stack Trace');
        console.error(stackTrace);
        console.groupEnd();
        console.groupEnd();
    }
}