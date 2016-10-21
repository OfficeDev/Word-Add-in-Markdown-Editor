import { platformBrowserDynamic, } from '@angular/platform-browser-dynamic';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { Authenticator } from '@microsoft/office-js-helpers';

import { BASE_ROUTES, FILE_ROUTES } from "./app/app.routes";
import { AppComponent, COMPONENTS } from "./app/components";
import { SERVICES } from "./app/shared/services";
import { PIPES } from "./app/shared/pipes";
import { HELPERS } from "./app/shared/helpers";

require('./assets/styles/spinner.scss');
require('./assets/styles/globals.scss');

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule, BASE_ROUTES, FILE_ROUTES],
    declarations: [...COMPONENTS, ...PIPES],
    bootstrap: [AppComponent],
    providers: [...SERVICES, ...HELPERS]
})
export class AppModule {
}

if (!Authenticator.isAuthDialog()) {
    Office.initialize = reason => { };
    platformBrowserDynamic().bootstrapModule(AppModule);
}