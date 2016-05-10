import {Injectable} from '@angular/core';
import GithubService from '../github/github.service';

@Injectable()
export default class WordService {
    constructor(private _githubService: GithubService) {

    }

    insertHtml() {
        this._githubService
            .getFileData()
            .subscribe(
            html => { return this._insertHtmlIntoWord(html); },
            error => { console.error(error); },
            () => { console.info('completed getting file data'); }
            );
    }

    private _run<T>(batch: (context: Word.RequestContext) => OfficeExtension.IPromise<T>) {
        return Word.run<T>(batch)
            .catch(function (error) {
                console.log('Error: ' + JSON.stringify(error));
                if (error instanceof OfficeExtension.Error) {
                    console.log('Debug info: ' + JSON.stringify(error.debugInfo));
                }
            });
    }

    private _insertHtmlIntoWord(html: string) {
        if (!Word) return;

        return this._run((context) => {
            var body = context.document.body;
            body.insertHtml(html, 'Replace');
            return context.sync();
        });
    }
}