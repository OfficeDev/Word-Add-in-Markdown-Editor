import { Observable } from 'rxjs/Rx';

export enum ContextType {
    Web,
    Word
}

export class Utilities {
    private static _context: ContextType;

    static replace(source: string): (key: string, value: string) => any {
        return function self(key: string, value: string): any {
            if (!key) return source;
            source = source.replace(key, value);
            return self;
        };
    }

    static regex(source: string): (key: RegExp, value: string) => any {
        return function self(key: RegExp, value: string): any {
            if (!key) return source;
            source = source.replace(key, value);
            return self;
        };
    }

    static isNull(obj: any): boolean {
        return _.isUndefined(obj) || _.isNull(obj);
    }

    static isEmpty(obj: any): boolean {
        return Utilities.isNull(obj) || _.isEmpty(obj);
    }

    static get isWord() {
        return this._context == ContextType.Word;
    }

    static get isWeb() {
        return this._context == ContextType.Web;
    }

    static error<T>(exception?: any): Observable<T> | Promise<T> | OfficeExtension.IPromise<T> {
        appInsights.trackException(exception);

        console.group(`Error: ${exception.message}`);
        if (exception.stack) {
            console.groupCollapsed('Stack Trace');
            console.error(exception.stack);
            console.groupEnd();
        }
        if (Utilities.isWord) {
            console.groupCollapsed('Office Exception');
            if (exception instanceof OfficeExtension.Error) {
                console.error('Debug info: ' + JSON.stringify(exception.debugInfo));
            }
            console.groupEnd();
        }

        console.groupEnd();
        return exception;
    }

    static setContext() {
        if (_.has(window, 'Office')) {
            if (_.has(window, 'Word')) {
                this._context = ContextType.Word;
            }
        }
        else {
            this._context = ContextType.Web;
        };
    }
}

Utilities.setContext();