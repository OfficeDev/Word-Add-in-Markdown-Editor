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
        var context = Office.context as any;

        var type1 = $(html);
        var type2 = $(`<div>${html}</div>`);
        var divType1 = type1.find('.WordSection1');
        var divType2 = type2.find('.WordSection1');
        debugger;

        var cleanedHtml = this._cleanHtml(html);

        var md = toMarkdown(cleanedHtml, {
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

        md = md.replace(/(<div class="WordSection1">\s)/gi, '');
        md = md.replace(/(\s<\/div>)/g, '');
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

            // move all content inside P tags created in TD to TD
            (/<td(?:.|\s)*?p>((?:.|\s)*?)<\/p(?:.|\s)*?td>/g, '<td>$1</td>')

            // move contents in SPAN outside the block
            // affected sections are tables and code
            (/<span>((?:.|\s)*?)<\/span>/g, '$1')

            // clear all &nbsp;
            // affected sections are code
            (/<pre>&nbsp;<\/pre>/g, '')

            // remove all PREs that come in between code blocks and add a new line instead
            (/<\/pre><pre>/g, '\n')

            // perform positive look ahead for all divs that come before a pre = begining of a code block section
            // the replacement value is a specific class that toMarkdown looks for to determine syntax highlighting
            (/<div>(?=<pre>)<pre>/g, '<div class="highlight highlight-javascript"><pre>\n')

            // look for all ; characters not a part of &quot; and add a line spacing to them
            (/;\s/g, ';\n\n')

            // clear all B tags as they are illegal in this scenario
            (/<\/?b>/g, '')

            // end the ending TABLE tag with TBODY
            (/<\/table>/, '</tbody>\n</table>\n')

            // generate output
            ();
    }
}