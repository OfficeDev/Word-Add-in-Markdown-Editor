import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx'
import { Storage } from '@microsoft/office-js-helpers';
import * as marked from 'marked';
import { Utilities } from '../helpers';

declare var toMarkdown: any;
declare var Microsoft: any;

@Injectable()
export class MarkdownService {
    private _storage: Storage<string>;

    constructor() {
        this._storage = new Storage<string>('MarkdownPreview');
    }

    convertToHtml(markdown: string) {
        return marked(markdown);
    }

    convertToMD(html: string) {
        appInsights.trackEvent('convert html to md');
        var start = performance.now();

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

        var end = performance.now();
        appInsights.trackMetric("markdown conversion duration", (end - start) / 1000);
        return md;
    }

    private _cleanHtml(html: string): string {
        return Utilities.regex(html)

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