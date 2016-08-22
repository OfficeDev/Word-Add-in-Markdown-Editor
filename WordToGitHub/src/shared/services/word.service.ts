import {Injectable} from "@angular/core";
import {MarkdownService, GithubService} from "./";
import {Utils} from "../helpers";
import * as marked from 'marked';
import {IImage} from './';

declare var toMarkdown: any;

@Injectable()
export class WordService {
    constructor(
        private _githubService: GithubService,
        private _markDownService: MarkdownService
    ) {

    }

    insertTemplate(md: string, link: string) {
        var html = this._markDownService.convertToHtml(md);
        return this.insertHtml(html, link)
    }

    insertHtml(html: string, link: string) {
        if (Utils.isEmpty(html)) return Promise.reject<string>(null);
        return Promise.resolve(this._insertHtmlIntoWord(html, link))
            .then(() => this._formatStyles())
    }


    insertNumberedList() {
        return this._run(context => {
            var selection = context.document.getSelection();
            selection.insertHtml('<ol start="1"><li>Item1</li><li>Item2</li><li>Item3</li><li></li></ol>', Word.InsertLocation.after);
            return context.sync();
        });
    }

    insertBulletedList() {
        return this._run(context => {
            var selection = context.document.getSelection();
            selection.insertHtml('<ul type="disc"><li>Item1</li><li>Item2</li><li>Item3</li><li></li></ul>', Word.InsertLocation.after);
            return context.sync();
        });
    }

    getMarkdown(link: string) {
        return this._run(context => {
            var html = context.document.body.getHtml();
            return context.sync().then(() => {
                var div = document.createElement('tempHtmlDiv');
                div.innerHTML = html.value;
                var images = div.getElementsByTagName('img');
                var altValue, srcValue;
                var toRemove = "Title: ";
                for (var i = 0, max = images.length; i < max; i++) {
                    altValue = images[i].getAttribute('alt');
                    altValue = altValue.replace(toRemove, "");
                    console.log("altvalue "+ altValue);
                    srcValue = images[i].getAttribute('src');
                    if (srcValue.toLowerCase().startsWith("~wrs")) {
                        images[i].setAttribute('src', link + "/" + altValue);
                    }
                    images[i].setAttribute('alt', altValue);
                }
                return this._markDownService.convertToMD(div.innerHTML);
            });
        });
    }

    getBase64EncodedStringsOfImages(link: string): OfficeExtension.IPromise<IImage[]> {
        var imagesArray: IImage[] = [];
        return this._run(context => {
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
                        var fileName = "Image" + uniqueNumber + "." + image.imageFormat;

                        image.hyperlink = "images/" + fileName;
                        image.altTextTitle = "images/" + fileName;
                        image.altTextDescription = "";
                        images.items[i].hyperlink = link + "/" + "images/" + fileName;
                        images.items[i].altTextTitle = "images/" + fileName;
                        images.items[i].altTextDescription = "";
                        imagesArray.push(image);
                    }
                }

                return context.sync().then(function () {
                    return imagesArray;
                });
            });
        });
    }

    private _run<T>(batch: (context: Word.RequestContext) => OfficeExtension.IPromise<T>): OfficeExtension.IPromise<T> {
        return Word.run<T>(batch).catch(exception => Utils.error<T>(exception) as OfficeExtension.IPromise<T>);
    }

    private _insertHtmlIntoWord(html: string, link: string) {
        return this._run((context) => {
            var body = context.document.body;
            var div = document.createElement('tempHtmlDiv');
            div.innerHTML = html;

            var images = div.getElementsByTagName('img');
            var altValue, srcValue, max, i;
            for (i = 0, max = images.length; i < max; i++) {
                altValue = images[i].parentElement.getAttribute('href');
                srcValue = images[i].getAttribute('src');
                var filename = _.last(srcValue.split('/'));
                console.log(images[i].width);
                if (!srcValue.toLowerCase().startsWith("http")) {
                    images[i].setAttribute('src', link + "/" + "images/"+ filename);
                }
            }

            html = div.innerHTML;
            body.insertHtml(html, Word.InsertLocation.replace);
            return context.sync();
        })
    }

    private _formatStyles() {
        return this._run((context) => {
            var body = context.document.body;
            // body.font.name = 'Segoe UI';
            // body.font.color = '#333333';
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
}