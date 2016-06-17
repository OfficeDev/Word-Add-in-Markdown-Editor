import {ExceptionHandler} from '@angular/core';

export class ExceptionHelper extends ExceptionHandler {
    call(exception: any, stackTrace?: any, reason?: string) {

        var invalidException = /TypeError: Object expected$/g;

        if (invalidException.test(exception.description || exception.message)) return;

        console.group(exception.description);
        console.error(exception);
        console.groupCollapsed('Stack Trace');
        console.error(stackTrace);
        console.groupEnd();
        console.groupEnd();
    }
}