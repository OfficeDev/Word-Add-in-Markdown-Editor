import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
    selector: 'toast',
    template: `
    <div class="ms-toast" *ngIf="!isHidden" [ngClass]="{'ms-toast--shown':!isHidden}">
        <div class="ms-toast__header">
            <h4 class="ms-toast__title ms-font-l ms-fontColor-themePrimary ms-fontWeight-semibold">{{title}}</h4>
            <i class="ms-toast__close ms-Icon ms-Icon--x" (click)="dismiss()"></i>
        </div>
        <div class="ms-toast__content">
            <i class="ms-toast__info ms-Icon ms-Icon-large ms-Icon--infoCircle ms-fontColor-themePrimary"></i>
            <p class="ms-toast__message ms-font-m">{{message}}</p>
        </div>
    </div>`,
    styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnChanges {
    @Input() message: string;
    @Input() title: string;
    @Input() duration: number;
    @Input() show: boolean;

    public isHidden = true;
    private _timeout;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['show'] && changes['show'].currentValue) {            
            this.showToast();
        }
    }

    showToast() {
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = this.duration || 5;
        this.isHidden = false;
        setTimeout(() => this.isHidden = true, this._timeout);
    }

    dismiss() {
        this.isHidden = true;
    }
}