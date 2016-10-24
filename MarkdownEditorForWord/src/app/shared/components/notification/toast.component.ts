import { Component, OnDestroy, ApplicationRef } from '@angular/core';
import { BaseComponent } from '../base.component';
import { MediatorService, IEventChannel, IToast } from '../../services';
import './toast.component.scss';

@Component({
    selector: 'toast',
    template: `
    <div class="ms-toast" [hidden]="isHidden" [ngClass]="{'ms-toast--shown':!isHidden}">
        <div class="ms-toast__header">
            <h4 class="ms-toast__title ms-font-l ms-fontColor-themePrimary ms-fontWeight-semibold">{{toast?.title}}</h4>
            <i class="ms-toast__close ms-Icon ms-Icon--x" (click)="dismiss()"></i>
        </div>
        <div class="ms-toast__content">
            <i class="ms-toast__info ms-Icon ms-Icon-large ms-Icon--infoCircle ms-fontColor-themePrimary"></i>
            <p class="ms-toast__message ms-font-m">{{toast?.toast}}</p>
        </div>
    </div>`
})
export class ToastComponent extends BaseComponent implements OnDestroy {
    toast: IToast;
    isHidden = true;

    private _timeout;
    private _toastChannel: IEventChannel;

    constructor(
        private _mediatorService: MediatorService,
        private _ref: ApplicationRef
    ) {
        super();
        this._toastChannel = this._mediatorService.createEventChannel<IToast>('toast-channel');
        var subscription = this._toastChannel.source$.debounceTime(300).subscribe(toast => this.showToast(toast));
        this.markDispose(subscription);
    }

    showToast(toast: IToast) {
        this.toast = toast;
        if (this._timeout) clearTimeout(this._timeout);
        this.isHidden = false;
        this._ref.tick();
        // setTimeout(() => this.dismiss(), 3000);
    }

    dismiss() {
        this.toast = null;
        this.isHidden = true;
        clearTimeout(this._timeout);
    }
}