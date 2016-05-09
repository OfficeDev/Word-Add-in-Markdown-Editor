///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from "./app.component";

try {
    Office.initialize = (reason)=> {
        console.log('Office is initialized');
        bootstrap(AppComponent);
    };
}
catch(e) {
    bootstrap(AppComponent);
}