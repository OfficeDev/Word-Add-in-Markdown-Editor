import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Path} from '../shared/helpers/utilities';
import {WordService} from '../shared/services/word.service';

let view = 'files-detail';
@Component({
    selector: view,
    templateUrl: Path.template(view)
})

export class FilesDetailComponent implements OnInit {
    constructor(private _wordService: WordService) { }

    ngOnInit(): any {
        //TODO: take file name as a parameter
        this._wordService.insertHtml();
    }
}