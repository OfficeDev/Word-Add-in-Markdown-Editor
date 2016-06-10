import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Utils, StorageHelper} from './';
import {IToken} from '../services';

@Injectable()
export class RequestHelper {
    private _token: IToken;
    private _username = "@user";
    private _storage: StorageHelper<IToken>;

    constructor(private _http: Http) {
        this._storage = new StorageHelper<IToken>("GitHubTokens");
        this._tryGetCachedToken();
    }

    get(url: string, options?: RequestOptions) {
        let requestOptions = options || this._generateHeaders();
        if (Utils.isNull(requestOptions)) {
            return this._http.get(url);
        }
        else {
            return this._http.get(url, requestOptions);
        }
    }

    raw(url: string, options?: RequestOptions) {
        if (Utils.isNull(options)) {
            return this._http.get(url);
        }
        else {
            return this._http.get(url, options);
        }
    }

    token(value?: IToken): IToken {
        if (!Utils.isNull(value)) {
            this._token = value;
        }

        if (Utils.isNull(this._token)) {
            this._token = this._tryGetCachedToken();
        }

        return this._token;
    }

    private _tryGetCachedToken(): IToken {
        var token = this._storage.get(this._username);
        if (Utils.isEmpty(token)) return null;

        this._token = token;
        return token;
    }

    private _generateHeaders(): RequestOptions {
        var headers = new Headers({
            "Accept": "application/json",
            "Authorization": "Bearer " + this.token().access_token
        });

        return new RequestOptions({ headers: headers });
    }
}