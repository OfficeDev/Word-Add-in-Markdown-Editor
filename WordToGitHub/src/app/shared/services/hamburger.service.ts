import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class HamburgerService {
    private _isHamburgerMenuShown = false;
    hamburgerMenuShown$ = new EventEmitter<boolean>();

    toggleMenu(force?: boolean) {
        if (force != null) this._isHamburgerMenuShown = force;
        this._isHamburgerMenuShown = !this._isHamburgerMenuShown;
        this.hamburgerMenuShown$.next(this._isHamburgerMenuShown);
    }

    showMenu() {
        this._isHamburgerMenuShown = true;
        this.hamburgerMenuShown$.next(true);
    }

    hideMenu() {
        this._isHamburgerMenuShown = false;
        this.hamburgerMenuShown$.next(false);
    }
}