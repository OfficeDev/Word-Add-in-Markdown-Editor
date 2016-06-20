import {Injectable} from '@angular/core';
import {Utils, StorageHelper} from '../helpers';
import marked from 'marked';
import {Observable, Observer} from 'rxjs/Rx'

declare var toMarkdown: any;
declare var Microsoft: any;

@Injectable()
export class MarkdownService {
    private _storage: StorageHelper<string>;

    constructor() {
        this._storage = new StorageHelper<string>('MarkdownPreview');
    }

    convertToHtml(markdown: string) {
        if (!Utils.isWord) return;

        return marked(markdown);
    }

    previewMarkdown(html: string){
        if (!Utils.isWord) return;

        var context = Office.context as any;
        var md = toMarkdown(html, { gfm: true });
        return md;
    }
}