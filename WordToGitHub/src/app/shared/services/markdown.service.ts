import {Injectable} from '@angular/core';
import {StorageHelper} from '../helpers/storage.helper';
import marked from 'marked';

declare var toMarkdown: any;
declare var Microsoft: any;

@Injectable()
export class MarkdownService {
    private _storage: StorageHelper<string>;

    constructor() {
        this._storage = new StorageHelper<string>('MarkdownPreview');    
    }

    convertToHtml(markdown: string) {
        return marked(markdown);
    }

    previewMarkdown(html: string) {
        var context = Office.context as any;
        var md = toMarkdown(html, { gfm: true });
        this._storage.add('preview', md);
        context.ui.displayDialogAsync(window.location.protocol + "//" + window.location.host + "/preview.html", { height: 40, width: 30 });
    }
}