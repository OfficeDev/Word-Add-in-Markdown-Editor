import { ErrorHandler } from '@angular/core';

export class ExceptionHelper implements ErrorHandler {
    handleError(exception: any) {
        console.group(exception.description || 'Handled Exception');
        console.error(exception);
        console.groupEnd();
    }
}