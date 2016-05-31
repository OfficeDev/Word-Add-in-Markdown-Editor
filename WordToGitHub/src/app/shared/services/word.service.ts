import {Injectable} from "@angular/core";
import {MarkdownService} from "./markdown.service";
import {GithubService} from "./github.service";

@Injectable()
export class WordService {
    constructor(
        private _githubService: GithubService,
        private _markDownService: MarkdownService
    ) {

    }

    insertHtml(name: string = 'simple-file') {
        this._githubService
            .file(name)
            .subscribe(
            md => {
                let html = this._markDownService.convertToHtml(md);
                this._insertHtmlIntoWord(html)
                    .then(() => { return this.formatTables(); })
            },
            error => { console.error(error); },
            () => { console.info('completed getting file data'); }
            );
    }

    private _run<T>(batch: (context: Word.RequestContext) => OfficeExtension.IPromise<T>) {
        return Word.run<T>(batch)
            .catch(function (error) {
                console.log('Error: ' + JSON.stringify(error));
                if (error instanceof OfficeExtension.Error) {
                    console.log('Debug info: ' + JSON.stringify(error.debugInfo));
                }
            });
    }

    private _insertHtmlIntoWord(html: string) {
        if (!Word) return;

        return this._run((context) => {
            var body = context.document.body;
            body.insertHtml(html, 'Replace');
            return context.sync();
        })
    }

    getHtmlFromWord() {
        if (!Word) return;

        return this._run((context) => {
            var html = context.document.body.getHtml();
            return context.sync()
                .then(function () {
                    console.log(html);
                    context.document.body.insertText(html.value, Word.InsertLocation.end);
                    return context.sync();
                })
                .then(function () {
                    console.log("Inserted html using getHtml");
                });
        });
    }

    cleanupLists() {
        if (!Word) return;

        return this._run((context) => {
            var paras = context.document.body.paragraphs;
            paras.load();
            return context.sync().then(function () {
                var para = paras.items[2] as any;
                console.log(para);
                var list = para.startNewList();
                list.load();
                return context.sync().then(function () {
                    list.insertParagraph("item1", 'start');
                    list.insertParagraph("item2", 'end');
                    list.insertParagraph("normal Paragraph before", 'before');
                    list.insertParagraph("normal Paragraph after", 'after');
                    return context.sync();
                })
            })
        }).catch(function (e) {
            console.log(e.description);
        });
    }

    formatTables() {
        if (!Word) return;

        return this._run((context) => {
            var body = context.document.body as any;
            var tables = body.tables;
            tables.load("style");
            return context.sync().then(function () {
                _.each(tables.items, (table: any) => {
                    console.log(table.style);
                    table.style = "Grid Table 4 - Accent 1";
                });

                return context.sync();
            })
        }).catch(function (e) {
            console.log(e.description);
        });
    }

    getHtmlFromWord2() {
        if (!Word) return;

        return this._run((context) => {
            var body = context.document.body;
            // Create a proxy object for the paragraphs collection.
            var paragraphs = body.paragraphs;
            context.load(paragraphs, 'text');
            return context.sync()
                .then(function () {
                    // var paragraphContents = paragraphs.items.map((paragraph)=> {
                    //     return {
                    //         contents: paragraph.text
                    //         //inlinePicture: paragraph.inlinePictures.load(),
                    //     }
                    // });
                    //
                    // return context.sync()
                    // .then(()=> {
                    //     paragraphContents.forEach((paragraph)=> {
                    //     body.insertText(paragraph.contents, Word.InsertLocation.end);
                    //
                    //     });
                    // });


                });
        });

    }
}

//         var images = paragraphs.items.map(function (paragraph) {
//             var inlinePictures = paragraph.inlinePictures;
//             context.load(inlinePictures);
//             return inlinePictures;
//         });
//
//         return context.sync()
//             .then(function () {
//                 images.forEach(function (inlinePictures) {
//                     if (inlinePictures.items.length > 0) {
//                         context.document.body.insertText("[Inline picture] ", "End");
//                     }
//                     else {
//                         context.document.body.insertText("[No inline picture] ", "Start");
//                     }
//                 })
//             });
//         // paragraph.insertText("[" + paragraph.style + "] ", "Start");
//     })
//     context.sync();
//
// });
