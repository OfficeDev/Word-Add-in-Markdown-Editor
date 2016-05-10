import {Injectable} from '@angular/core';
import marked from 'marked';

@Injectable()
export default class MarkdownService {
    constructor() {

    }
    
    convertToHtml(markdown: string) {
        return marked(markdown);
    }
}