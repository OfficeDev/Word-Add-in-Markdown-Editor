import {Injectable} from '@angular/core';
import {Utils, StorageHelper} from '../helpers';
import marked from 'marked';
import {Observable, Observer} from 'rxjs/Rx'

declare var toMarkdown: any;
declare var Microsoft: any;

@Injectable()
export class MarkdownService {
    private _storage: StorageHelper<string>;
    private convertors: any;

    constructor() {
        this._storage = new StorageHelper<string>('MarkdownPreview');
        this.convertors = [
            {
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
            }
        ];
}
    
    

    convertToHtml(markdown: string) {
        if (!Utils.isWord) return;

        return marked(markdown);
    }

    cleanHtml(html: string): string {
        //html = html.replace(/(<td valign=top style='border:solid #5B9BD5 1.0pt;border-right:none;\n..background:#5B9BD5;padding:0in 5.4pt 0in 5.4pt'>\n..<p class=MsoNormal style='margin-bottom:0in;\nmargin-bottom:.0001pt;line-height:\n..normal'><span style='color:white'>)/gmi, '<th align="left">');
        //html = html.replace(/<th align="left">.*?(<\/span><\/p>\n..<\/td>)/gmi, '</th>');
        //html = html.replace(/(<td valign=top style='border:solid #9CC2E5 1.0pt;border-top:none;background:\n..#DEEAF6;padding:0in 5.4pt 0in 5.4pt'>\n..<p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:\n..normal'><b>)/gmi, '<td align="left">');
        //html = html.replace(/<td align="left">.*?(<\/span><\/p>\n..<\/td>)/gmi, '</td>');
        //html = html.replace(/(<\/th>\n.<\/tr>\n.<tr>\n..<td)/gmi, '</th></tr></thead><tbody><tr><td');
        //html = html.replace(/<\/tr>\n<\/table>/gmi, '</tr></tbody></table>');

        return Utils.regex(html)

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

    previewMarkdown(html: string) {
        if (!Utils.isWord) return;

        var context = Office.context as any;
        var cleanedHtml = this.cleanHtml(html)
        //var cleanedHtml = html;
        var md = toMarkdown(cleanedHtml, this.convertors, { gfm: true });
        md = md.replace(/(<div class="WordSection1">\s)/gi, '');
        md = md.replace(/(\s<\/div>)/g, '');
        return md;
}
}