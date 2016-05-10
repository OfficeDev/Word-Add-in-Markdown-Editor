import { bootstrap } from '@angular/platform-browser-dynamic';
import { AppComponent } from "./app.component";

// try {
//     Office.initialize = (reason) => {
//         console.log('Office is initialized');
//         bootstrap(AppComponent);
//     };
// }
// catch (e) {
    bootstrap(AppComponent);
// }