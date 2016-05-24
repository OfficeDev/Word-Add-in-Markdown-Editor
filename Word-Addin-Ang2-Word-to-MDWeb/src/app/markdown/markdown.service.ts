import {Injectable} from '@angular/core';
import marked from 'marked';

@Injectable()
export class MarkdownService {
    constructor() {

    }
    
    convertToHtml(markdown: string) {
        return marked(markdown);
    }
}