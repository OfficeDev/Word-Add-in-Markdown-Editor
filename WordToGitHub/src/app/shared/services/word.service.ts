import {Injectable} from "@angular/core";
import {MarkdownService, GithubService} from "./";
import {Utils} from "../helpers";
import marked from 'marked'; 

declare var toMarkdown: any;

@Injectable()
export class WordService {
    constructor(
        private _githubService: GithubService,
        private _markDownService: MarkdownService
    ) {

    }

    insertHtml(html: string) {
        if (Utils.isEmpty(html)) return Promise.reject(null);

        return Promise.resolve(this._insertHtmlIntoWord(html))
            .then(() => this._formatTables())
    }

    private _insertGeneratedHtmlIntoWord() {
        return this._run((context) => {
            var html = context.document.body.getHtml().value;
            return context.sync().then(() => {
                context.document.body.insertText(html, Word.InsertLocation.end);
                return context.sync();
            })
        })
    }

    getHtml() {
        if (!Utils.isWord) return;

        return this._run<string>((context) => {
            var html = context.document.body.getHtml();
            return context.sync().then(() => {
                var md = toMarkdown(html.value, { gfm: true });
                return md;
            });
        })
    }

    getMarkdown() {
        var markdown;
        if (!Utils.isWord) return;

        return this._run<string>((context) => {
            var htmlObj = context.document.body.getHtml();
            return context.sync().then(() => {
                var html = htmlObj.value;
                html = html.replace(/<table class=MsoTable15Grid4Accent1 border=1 cellspacing=0 cellpadding=0\\n.style='border-collapse:collapse;border:none'>/, '<table><thead>');
                html = html.replace(/(<td valign=top style='border:solid #5B9BD5 1.0pt;border-right:none;\n..background:#5B9BD5;padding:0in 5.4pt 0in 5.4pt'>\n..<p class=MsoNormal style='margin-bottom:0in;\nmargin-bottom:.0001pt;line-height:\n..normal'><span style='color:white'>)/gmi, '<th align="left">');
                html = html.replace(/<th align="left">.*?(<\/span><\/p>\n..<\/td>)/gmi, '</th>');
                html = html.replace(/(<td valign=top style='border:solid #9CC2E5 1.0pt;border-top:none;background:\n..#DEEAF6;padding:0in 5.4pt 0in 5.4pt'>\n..<p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:\n..normal'><b>)/gmi, '<td align="left">');
                html = html.replace(/<td align="left">.*?(<\/span><\/p>\n..<\/td>)/gmi, '</td>');
                html = html.replace(/(<\/th>\n.<\/tr>\n.<tr>\n..<td)/gmi, '</th></tr></thead><tbody><tr><td');
                html = html.replace(/<\/tr>\n<\/table>/gmi, '</tr></tbody></table>');

                markdown = this._markDownService.previewMarkdown(html)
                    //.subscribe((md) => {
                    //    var pattern1 = new RegExp('(<div class="WordSection1">\n)');
                    //    md.replace(pattern1, '');
                    //    var pattern2 = new RegExp('(\n<\/div>)');
                    //    md.replace(pattern2, '');
                    //    markdown = md; 
                    //});
                return markdown;
            });
        })
    }

    private _run<T>(batch: (context: Word.RequestContext) => OfficeExtension.IPromise<T>): OfficeExtension.IPromise<T> {
        return Word.run<T>(batch).catch(exception => Utils.error<T>(exception) as OfficeExtension.IPromise<T>);
    }

    private _insertHtmlIntoWord(html: string) {
        return this._run((context) => {
            var body = context.document.body;
            body.insertHtml(html, Word.InsertLocation.replace);
            return context.sync();
        })
    }

    private _insertTextIntoWord(html: string) {
        return this._run((context) => {
            var body = context.document.body;
            body.insertText(html, 'Replace');
            return context.sync();
        })
    }

    private _cleanupLists() {
        return this._run((context) => {
            var paras = context.document.body.paragraphs;
            paras.load();
            return context.sync()
                .then(() => {
                    var para = paras.items[2] as any;
                    console.log(para);
                    var list = para.startNewList();
                    list.load();
                    return context.sync().then(() => {
                        list.insertParagraph("item1", 'start');
                        list.insertParagraph("item2", 'end');
                        list.insertParagraph("normal Paragraph before", 'before');
                        list.insertParagraph("normal Paragraph after", 'after');
                        return context.sync();
                    })
                });
        });
    }

    private _formatTables() {
        return this._run((context) => {
            var body = context.document.body as any;
            var tables = body.tables;
            tables.load("style");
            return context.sync().then(() => {
                _.each(tables.items, (table: any) => {
                    console.log(table.style);
                    table.style = "Grid Table 4 - Accent 1";
                });
                return context.sync();
            })
        });
    }
}