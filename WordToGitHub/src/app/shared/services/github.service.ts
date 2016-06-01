import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {Utils} from '../helpers/utilities';

declare var Microsoft: any;

export interface IRepository {
    id: number;
    name: string;
    description: string;
    full_name?: string;
    owner_login?: string;
    private?: boolean;
    html_url?: string;
}

export interface IFile {
    id: number
    name: string;
    path?: string;
    url?: string;
    content?: string;
    branch?: string;
    authorName?: string;
    authorEmail?: string;
}


@Injectable()
export class GithubService {
    private _baseUrl: string = "";

    constructor(private _http: Http) { }

    repos(): Observable<IRepository[]> {
        let url = Utils.getMockFileUrl("json", "repository");
        return this._http.get(url).map(response => response.json());
    }

    files(): Observable<IFile[]> {
        let url = Utils.getMockFileUrl("json", "file");
        return this._http.get(url).map(response => response.json());
    }

    file(name: string): Observable<string> {
        let url = Utils.getMockFileUrl("md", name);
        return this._http.get(url).map(response => response.text());
    }

    login(): Observable<string> {
        return Observable.create(observer => {
            var context = Office.context as any;
            context.ui.displayDialogAsync(window.location.protocol + "//" + window.location.host + "/authorize.html", { height: 30, width: 20 },
                result => {
                    var dialog = result.value;
                    dialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, (args) => {
                        dialog.close();

                        if (Utils.isEmpty(args.message)) {
                            observer.error("No token received");
                        }
                        else {
                            try {
                                var token = JSON.parse(args.message);
                                observer.next(token);
                            }
                            catch (exception) {
                                observer.error(exception);
                            }
                        }

                        observer.complete();
                    });
                });

            return () => { console.info('Observable disposed'); }
        });
    }
}