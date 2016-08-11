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

    insertTemplate(md: string, orgName: string, repoName: string, branchName: string) {
        var html = this._markDownService.convertToHtml(md);
        return this.insertHtml(html, orgName, repoName, branchName)
    }

    insertHtml(html: string, orgName: string, repoName: string, branchName: string) {
        if (Utils.isEmpty(html)) return Promise.reject<string>(null);
        return Promise.resolve(this._insertHtmlIntoWord(html, orgName, repoName, branchName))
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
        return this._run<string>((context) => {
            var html = context.document.body.getHtml();
            return context.sync().then(() => {
                var md = toMarkdown(html.value, { gfm: true });
                return md;
            });
        })
    }

    //styleAsCode() {
    //    return this._run((context) => { 
    //        var selection = context.document.getSelection();
    //        selection.style = 'HTML Code';
    //        return context.sync();
    //    });
    //}

    insertNumberedList() {
        return this._run((context) => {
            var selection = context.document.getSelection();
            selection.insertHtml('<ol start="1"><li>Item1</li><li>Item2</li><li>Item3</li><li></li></ol>', Word.InsertLocation.after);
            return context.sync();
        });
    }

    insertBulletedList() {
        return this._run((context) => {
            var selection = context.document.getSelection();
            selection.insertHtml('<ul type="disc"><li>Item1</li><li>Item2</li><li>Item3</li><li></li></ul>', Word.InsertLocation.after);
            return context.sync();
        });
    }

    getMarkdown(orgName: string, repoName: string, branchName: string) {
        return Word.run(context => {
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
                    srcValue = images[i].getAttribute('src');
                    if (srcValue.toLowerCase().startsWith("~wrs")) {
                        images[i].setAttribute('src', "https://raw.githubusercontent.com/" + orgName + "/" + repoName + "/" + branchName + "/" + altValue);
                    }
                }
                return this._markDownService.previewMarkdown(div.innerHTML);
            });
        });
    }

    private _run<T>(batch: (context: Word.RequestContext) => OfficeExtension.IPromise<T>): OfficeExtension.IPromise<T> {
        return Word.run<T>(batch).catch(exception => Utils.error<T>(exception) as OfficeExtension.IPromise<T>);
    }

    private _insertHtmlIntoWord(html: string, orgName: string, repoName: string, branchName: string) {
        return this._run((context) => {

            var body = context.document.body;


            var div = document.createElement('tempHtmlDiv');
            div.innerHTML = html;

            var images = div.getElementsByTagName('img');
            var altValue, srcValue, max, i;

            for (i = 0, max = images.length; i < max; i++) {
                altValue = images[i].parentElement.getAttribute('href');
                srcValue = images[i].getAttribute('src');
                console.log(images[i].width);
                console.log(srcValue);
                if (!srcValue.toLowerCase().startsWith("http")) {
                    images[i].setAttribute('src', "https://raw.githubusercontent.com/" + orgName + "/" + repoName + "/" + branchName + "/" + altValue);
                }
            }

            html = div.innerHTML;

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

    getBase64EncodedStringsOfImages(orgName: string, repoName: string, branchName: string): OfficeExtension.IPromise<IImage[]> {
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
                        if (!Utils.isEmpty(images.items[i].altTextDescription)) {
                            fileName = _.last(images.items[i].altTextDescription.split('\\'));
                        }

                        image.hyperlink = "images/" + fileName;
                        images.items[i].hyperlink = "https://raw.githubusercontent.com/"+orgName+"/"+repoName+"/"+branchName+"/" + "images/" + fileName;
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