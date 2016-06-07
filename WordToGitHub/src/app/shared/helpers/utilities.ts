import {Observable} from 'rxjs/Rx';

export enum ContextType {
    Web,
    Word
}

export class Path {
    static template(view: string, parent?: string): string {
        return 'app/' + (parent || view) + '/' + view + '.component.html';
    }

    static style(view: string, parent?: string): string {
        return 'app/' + (parent || view) + '/' + view + '.component.css';
    }
}

export class Utils {
    private static _context: ContextType;

    static replace(source: string): (key: string, value: string) => any {
        return function self(key: string, value: string): any {
            if (!key) return source;
            source = source.replace(key, value);
            return self;
        };
    }

    static isNull(obj: any): boolean {
        return _.isUndefined(obj) || _.isNull(obj);
    }

    static isEmpty(obj: any): boolean {
        return Utils.isNull(obj) || _.isEmpty(obj);
    }

    static get isWord() {
        return this._context == ContextType.Word;
    }

    static get isWeb() {
        return this._context == ContextType.Web;
    }

    static getMockFileUrl(source: string, name: string): string {
        let baseUrl = window.location.protocol + "//" + window.location.host + '/app/shared/mocks/@source/@name';

        return Utils.replace(baseUrl)
            ('@source', source)
            ('@name', name + "." + source)
            ();
    }

    static error<T>(exception: any): Promise<T> | OfficeExtension.IPromise<T> {
        console.log('Error: ' + JSON.stringify(exception));

        if (Utils.isWord) {
            if (exception instanceof OfficeExtension.Error) {
                console.log('Debug info: ' + JSON.stringify(exception.debugInfo));
            }
        }

        return exception;
    }

    static text(request: Observable<any>): Promise<string> {
        return request.toPromise()
            .then(response => response.text() as string)
            .catch(Utils.error);
    }

    static json<T>(request: Observable<any>): Promise<T> {
        return request.toPromise()
            .then(response => response.json() as T)
            .catch(Utils.error);
    }

    static setContext() {
        if (_.has(window, 'Office') && _.has(window, 'Word')) {
            this._context = ContextType.Word;
        }
        else {
            this._context = ContextType.Web;
        };
    }
}

Utils.setContext();