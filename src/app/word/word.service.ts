import {Injectable} from "@angular/core";
import GithubService from "../github/github.service";

@Injectable()
export default class WordService {
    constructor(private _githubService:GithubService) {

    }

    sayHello() {
        console.log("Hello");
    }

    insertHtml() {
        this._githubService
            .getFileData()
            .subscribe(
                html => {
                    return this._insertHtmlIntoWord(html)
                        .then(()=> {
                            return this.getHtmlFromWord();
                            //return this.getHtmlFromWord2();
                        });
                },
                error => {
                    console.error(error);
                },
                () => {
                    console.info('completed getting file data');
                }
            );
    }

    private _run<T>(batch:(context:Word.RequestContext) => OfficeExtension.IPromise<T>) {
        return Word.run<T>(batch)
            .catch(function (error) {
                console.log('Error: ' + JSON.stringify(error));
                if (error instanceof OfficeExtension.Error) {
                    console.log('Debug info: ' + JSON.stringify(error.debugInfo));
                }
            });
    }

    private _insertHtmlIntoWord(html:string) {
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
            console.log("Entered getHtmlFromWord and have Word");
            var html = context.document.body.getHtml();
            return context.sync()
                .then(function () {
                    console.log(html);
                    context.document.body.insertText(html.value, Word.InsertLocation.end);
                    return context.sync();
                })
                .then(function () {
                    console.log("Inserted html using method 1");
                });
        });
    }

    getHtmlFromWord2() {
        if (!Word) return;

        return this._run((context) => {
            var body = context.document.body;
            // Create a proxy object for the paragraphs collection.
            var paragraphs = body.paragraphs;
            // Queue a commmand to load the text and style properties for all of the paragraphs.
            context.load(paragraphs, 'text, style');

            return context.sync()
                .then(()=> {
                    // for (let i = 0; i < paragraphs.items.length; i++) {
                    //     let styleName:string = paragraphs.items[i].style;
                    //     let paragraphContents = paragraphs.items[i].getHtml();
                    //
                    //     context.document.body.insertText(paragraphContents.value+" "+styleName, Word.InsertLocation.end);
                    // }

                    // var paragraphContents = paragraphs.items.map((paragraph)=> {
                    //     return {
                    //         style: paragraph.style,
                    //         contents: paragraph.getHtml()
                    //     }
                    // });

                    var html = paragraphs.items[0].getHtml();
                    console.log(html);
                    // console.log(paragraphContents);

                    return context.sync()
                        .then(()=> {
                            // paragraphContents.forEach((paragraph)=> {
                                context.document.body.insertText(html.value + " " + paragraphs.items[0].style, Word.InsertLocation.end);
                                // console.log(paragraph);
                                // context.document.body.insertText(paragraph.contents.value + " " + paragraph.style, Word.InsertLocation.end);
                            // });
                        });
                });
        });
    }
}