import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template:
    `<hamburger></hamburger>
    <main class="app__main ms-font-m ms-fontColor-neutralPrimary">
        <message-bar></message-bar>
        <router-outlet></router-outlet>
        <toast></toast>
    </main>
    <footer class="app-container__footer"></footer>`
})

export class AppComponent {
}