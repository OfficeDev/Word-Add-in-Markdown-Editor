import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {WordService} from '../word/word.service';

@Component({
    selector: 'my-md-file-detail',
    template: `
  
    `
})

export class FileDetailComponent implements OnInit {


    constructor(private _wordService: WordService, private _router: Router) {}


    ngOnInit():any {
        this._wordService.insertHtml();
    }
}