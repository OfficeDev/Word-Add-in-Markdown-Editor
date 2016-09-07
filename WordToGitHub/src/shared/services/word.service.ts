import {Injectable} from "@angular/core";
import {MarkdownService, GithubService, IImage} from "../services";
import {Utils} from "../helpers";
import * as marked from 'marked';

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

    insertHtml(html: string, link: string): Promise<any> {
        appInsights.trackEvent('insert html', null, { 'length': html.length });
        var start = performance.now();
        if (Utils.isEmpty(html)) return Promise.reject<string>(null);
        return this._run(context => {
            return this._insertHtmlIntoWord(context, html, link)
                .then(() => this._formatStyles(context))
                .then(() => {
                    var end = performance.now();
                    appInsights.trackMetric("Insert HTML duration", (end - start) / 1000);
                });
        })
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

    getMarkdown(link: string, hasInlinePictures: boolean) {
        return this._run(context => {
            var html = context.document.body.getHtml();
            return context.sync().then(() => {
                var div = document.createElement('tempHtmlDiv');
                div.innerHTML = html.value;

                if (hasInlinePictures) {
                    var images = div.getElementsByTagName('img');
                    var altValue, srcValue;
                    var toRemove = "Title: ";
                    for (var i = 0, max = images.length; i < max; i++) {
                        altValue = images[i].getAttribute('alt');
                        altValue = altValue.replace(toRemove, "");
                        console.log("altvalue " + altValue);
                        srcValue = images[i].getAttribute('src');
                        if (srcValue.toLowerCase().startsWith("~wrs")) {
                            images[i].setAttribute('src', link + "/" + altValue);
                        }
                    }
                }
                return this._markDownService.convertToMD(div.innerHTML);
            });
        });
    }

    getBase64EncodedStringsOfImages(link: string): OfficeExtension.IPromise<IImage[]> {
        var start = performance.now();
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
                    var end = performance.now();
                    appInsights.trackEvent('images loaded from word', null, { "number of images": imagesArray.length });
                    appInsights.trackMetric('images load duration', (end - start) / 1000);
                    return imagesArray;
                });
            });
        });
    }

    private _run<T>(batch: (context: Word.RequestContext) => OfficeExtension.IPromise<T>): OfficeExtension.IPromise<T> {
        return Word.run<T>(batch).catch(exception => Utils.error<T>(exception) as OfficeExtension.IPromise<T>);
    }

    private _insertHtmlIntoWord(context: Word.RequestContext, html: string, link: string) {
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
                images[i].setAttribute('src', link + "/" + "images/" + filename);
            }
        }

        html = div.innerHTML;
        body.insertHtml(html, Word.InsertLocation.replace);
        return context.sync();
    }

    private _formatStyles(context: Word.RequestContext) {
        var tables = context.document.body.tables.load('style');
        var paragraphs = context.document.body.paragraphs.load(['style', 'text']);
        return context.sync().then(() => {
            _.each(paragraphs.items, paragraph => {
                switch (paragraph.style) {
                    case 'HTML Preformatted':
                    case 'undefined':
                    case '':
                    case 'pl-c':
                        paragraph.style = 'HTML Preformatted';
                        break;

                    case 'Normal (Web)':
                        paragraph.style = 'Normal';

                    default:
                        paragraph.font.size = 11;
                        paragraph.font.name = 'Segoe UI';
                        paragraph.font.color = '#333333';
                        break;
                }
            });

            _.each(tables.items, table => {
                table.style = "Plain Table 1";
                table.verticalAlignment = Word.VerticalAlignment.center;
                table.styleFirstColumn = false;
                table.headerRowCount = 0;
                table.styleBandedRows = true;
                table.autoFitContents();
            });

            return context.sync();
        });
    }
}