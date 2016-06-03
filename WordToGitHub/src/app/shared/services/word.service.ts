import {Injectable} from "@angular/core";
import {MarkdownService} from "./markdown.service";
import {GithubService} from "./github.service";
import {Utils} from "../helpers/utilities";

declare var toMarkdown: any;

@Injectable()
export class WordService {
    constructor(
        private _githubService: GithubService,
        private _markDownService: MarkdownService
    ) {

    }

    insertHtml(name: string) {
        if (!Utils.isWord) return;

        return this._githubService.file(name)
            .then(md => {
                let html = this._markDownService.convertToHtml(md);
                return this._insertHtmlIntoWord(html);
            })
        .then(() => this._formatTables())
    }

    getHtml() {
        if (!Utils.isWord) return;

        return this._run<string>((context) => {
            var html = context.document.body.getHtml();
            return context.sync().then(() => {
                var blah = toMarkdown(html.value, { gfm: true });
                return html.value;
            });
        })
            //.then(html => this._markDownService.previewMarkdown((html)));
    }

    private _run<T>(batch: (context: Word.RequestContext) => OfficeExtension.IPromise<T>): OfficeExtension.IPromise<T> {
        return Word.run<T>(batch).catch(Utils.error);
    }

    private _insertHtmlIntoWord(html: string) {
        return this._run((context) => {
            var body = context.document.body;
            body.insertHtml(html, 'Replace');
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