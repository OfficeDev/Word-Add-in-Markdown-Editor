import { Component } from '@angular/core';
import WordService from '../word/word.service';

@Component({
    selector: 'word-md-addin',
    templateUrl: 'www/app/home/home.component.html',
    styleUrls: ['www/app/home/home.component.css'],
    providers: [WordService]
})

export default class HomeComponent {
    constructor(private _wordService: WordService) {
        _wordService.sayHello();
        _wordService.insertHtml();
    }
}