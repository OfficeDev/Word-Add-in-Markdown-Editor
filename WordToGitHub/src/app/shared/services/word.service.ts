import {Injectable} from "@angular/core";
import {MarkdownService, GithubService} from "./";
import {Utils} from "../helpers";
import marked from 'marked';
import {IImage} from './';

declare var toMarkdown: any;

@Injectable()
export class WordService {
    constructor(
        private _githubService: GithubService,
        private _markDownService: MarkdownService
    ) {

    }

    insertTemplate(type: string) {
        this._githubService
            .getFileData(type)
            .subscribe(
            md => {
                var html = this._markDownService.convertToHtml(md);
                return this.insertHtml(html)
            },
            error => {
                console.error(error);
            },
            () => {
                console.info('completed inserting tempte');
            }
            );
    }

    insertHtml(html: string) {
        if (Utils.isEmpty(html)) return Promise.reject<string>(null);

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
        if (!Utils.isWord) return;

        return this._run<string>((context) => {
            var html = context.document.body.getHtml();

            return context.sync().then(() => {
                var div = document.createElement('tempHtmlDiv');
                div.innerHTML = html.value;

                //// Generate the html manually for lists
                //var lists = context.document.body.lists.load();
                
                //return context.sync().then(() => {
                //    if (lists.items.length > 0) {
                //        for (var i = 0; i < lists.items.length; i++) {
                //            var listHtml = "";
                //            var parasLevel0 = lists.items[i].getLevelParagraphs(0)();
                //            return context.sync().then(() => {
                //                for (var j = 0; j < parasLevel0.length; j++) {
                //                    if (parasLevel0.items[j].isListItem) {


                //                    }
                //                })

                //        }


                //        }
                //    }

                    // Fix the img tags
                    var images = div.getElementsByTagName('img');
                    var altValue, srcValue;
                    var toRemove = "Title: ";

                    for (var i = 0, max = images.length; i < max; i++) {
                        altValue = images[i].getAttribute('alt');
                        altValue = altValue.replace(toRemove, "");
                        srcValue = images[i].getAttribute('src');
                        if (srcValue.toLowerCase().startsWith("~wrs")) {
                            images[i].setAttribute('src', "https://raw.githubusercontent.com/umasubra/office-js-docs/master/" + altValue);
                        }
                    }
                    return this._markDownService.previewMarkdown(div.innerHTML);
                });
            });
}

    private _run<T>(batch: (context: Word.RequestContext) => OfficeExtension.IPromise<T>): OfficeExtension.IPromise<T> {
        return Word.run<T>(batch).catch(exception => Utils.error<T>(exception) as OfficeExtension.IPromise<T>);
    }

    private _insertHtmlIntoWord(html: string) {
        return this._run((context) => {

            var body = context.document.body;


            var div = document.createElement('tempHtmlDiv');
            div.innerHTML = html;

            var images = div.getElementsByTagName('img');
            var altValue, srcValue, max, i;

            for (i = 0, max = images.length; i < max; i++) {
                altValue = images[i].parentElement.getAttribute('href');
                srcValue = images[i].getAttribute('src');
                console.log(srcValue);
                if (!srcValue.toLowerCase().startsWith("http")) {
                    images[i].setAttribute('src', "https://raw.githubusercontent.com/umasubra/office-js-docs/master/" + altValue);
                }
            }

            //var regex = new RegExp('<img src="(.*?)" (.*?)>', 'g');
            //regex.exec(html).forEach(match => {
            //    if (!Utils.isEmpty(match)) {
                    
            //    }
            //});
            
            //html = Utils.regex(html)
            //    (/<img src="(.*?)" (.*?)>/g, '<img src="https://raw.githubusercontent.com/umasubra/office-js-docs/master/$1" $2>')
            //    ();

            html = div.innerHTML;

            body.insertHtml(html, Word.InsertLocation.replace);


            //var re = /<img src="(.*?)" (.*?)>/g;
            //var newHtml = html.replace(re, '<img src="https://raw.githubusercontent.com/umasubra/office-js-docs/master/$1" $2>');

            ////html = Utils.regex(html)
            ////    (/<img src="(.*?)" alt.*?>/g, 'https://raw.githubusercontent.com/umasubra/office-js-docs/master/$1')
            ////    ();
            //body.insertHtml(newHtml, Word.InsertLocation.replace);
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
                    table.style = "Grid Table 4 - Accent 1";
                });
                return context.sync();
            })
        });
    }

    getBase64EncodedStringsOfImages(): OfficeExtension.IPromise<IImage[]> {
        var imagesArray: IImage[] = [];
        return this._run((context) => {
            var images = context.document.body.inlinePictures;
            images.load();
            return context.sync().then(() => {
                for (var i = 0; i < images.items.length; i++) {
                    var image = <IImage>{
                        imageFormat: images.items[i].imageFormat,
                        altTextTitle: images.items[i].altTextTitle,
                        altTextDescription: images.items[i].altTextDescription,
                        height: images.items[i].height,
                        width: images.items[i].width,
                        hyperlink: images.items[i].hyperlink,
                        base64ImageSrc: images.items[i].getBase64ImageSrc()

                    }
                    if (Utils.isEmpty(image.hyperlink)) {
                        var uniqueNumber = new Date().getTime();
                        var fileName = "image" + uniqueNumber + "." + image.imageFormat;
                        image.hyperlink = "images/" + fileName;
                        images.items[i].hyperlink = "https://raw.githubusercontent.com/umasubra/office-js-docs/master/" + "images/" + fileName;
                        images.items[i].altTextTitle = "images/" + fileName;
                        imagesArray.push(image);
                    }
                }

                return context.sync().then(function () {                  
                    return imagesArray;
                });
            });
        });
    }
}