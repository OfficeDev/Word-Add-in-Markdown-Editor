import {Component} from '@angular/core';
import {Router, OnActivate, RouteSegment} from '@angular/router';
import {Path} from '../shared/helpers/utilities';
import {MarkdownService} from '../shared/services/markdown.service';
import {WordService} from '../shared/services/word.service';

let view = 'file-detail';
@Component({
    templateUrl: Path.template(view),
    providers: [MarkdownService, WordService]
})

export class FileDetailComponent implements OnActivate {
    constructor(private _wordService: WordService) { }

    routerOnActivate(current: RouteSegment) {
        let name = current.getParam('id');
        console.log('Loading data for file', name);

        //TODO: take file name as a parameter
        this._wordService.insertHtml(name);
    }
}