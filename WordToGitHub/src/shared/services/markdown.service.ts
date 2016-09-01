import {Injectable} from '@angular/core';
import {Utils, StorageHelper} from '../helpers';
import * as marked from 'marked';
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
        return marked(markdown);
    }

    convertToMD(html: string) {
        var wrappingElement = document.createElement('div');
        wrappingElement.classList.add('highlight')
        wrappingElement.classList.add('highlight-javascript');

        var extractedHtml = $(`<div>${this._cleanHtml(html)}</div>`).find('.WordSection1');
        extractedHtml.children('pre').wrap(wrappingElement);

        extractedHtml.find('td').each((index, elem) => {
            var content = '';
            var td = $(elem);

            var ps = td.children('p');
            if (ps.length == 1) {
                content = ps.text();
                ps.remove();
            }
            else {
                ps.each((index, p) => {
                    content += $(p).text();
                    $(p).remove();
                });
            }

            td.text(content);
        });

        var md = toMarkdown(extractedHtml.html(), {
            gfm: true,
            converters: [{
                filter: 'li',
                replacement: function (content, node) {
                    content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ')
                    var prefix = '*   '
                    var parent = node.parentNode
                    var grandparent = parent.parentNode
                    var index = Array.prototype.indexOf.call(parent.children, node) + 1

                    if (/ol/i.test(grandparent.nodeName) || /ul/i.test(grandparent.nodeName)) {
                        prefix = /ol/i.test(parent.nodeName) ? ' ' + index + '.  ' : ' *   '
                    }
                    else {
                        prefix = /ol/i.test(parent.nodeName) ? index + '.  ' : '*   '
                    }

                    return prefix + content
                }
            }]
        });

        return md;
    }

    private _cleanHtml(html: string): string {
        return Utils.regex(html)

            // clean the TABLE, TD, P or SPAN tags by removing any additional properties added by Word
            // this step is necessary as it optimizes the regex for further steps
            // else we end up in catastrophic backtracking http://www.regular-expressions.info/catastrophic.html
            (/<(table|td|p|span)\s(?:.|\s)*?>/g, '<$1>')

            // wrap the first TR in a table with THEAD tag and start a TBODY tag at the end of it
            (/<table(?:.|\s)*?tr>((?:.|\s)*?)<\/tr>/g, '<table>\n<thead>\n<tr>$1</tr>\n</thead>\n<tbody>\n')

            // end the ending TABLE tag with TBODY  
            (/<\/table>/, '</tbody>\n</table>\n')

            // replace all span with their contents
            (/<(?:\/|)span>/g, '')

            // replace all var with blockquotes
            (/<(\/|)var>/g, '<$1blockquote>')

            // replace all span with their contents
            (/<\/pre><pre>/g, '\n')

            // generate output
            ();
    }
}