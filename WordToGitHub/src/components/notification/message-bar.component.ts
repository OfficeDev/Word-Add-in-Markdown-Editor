import {Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';

@Component({
    selector: 'message-bar',
    styleUrls: ['./message-bar.component.scss'],
    template: `
    <div class="ms-MessageBar mw-message-bar" [ngClass]="variant.class" *ngIf="show">
        <div class="ms-MessageBar-content mw-message-bar__content">
            <div class="ms-MessageBar-icon">
                <i class="ms-Icon ms-Icon-large" [ngClass]="variant.icon"></i>
            </div>
            <div class="ms-MessageBar-text mw-message-bar__message ms-font-m">
                {{message}}<br>
                <a [href]="url" target="_new" class="ms-Link" [hidden]="action==null">{{action}}</a>
            </div>
            <div class="mw-message-bar__icon" (click)="dismiss()">
                <i class="ms-Icon ms-Icon--x"></i>
            </div>
        </div>
    </div>`
})
export class MessageBarComponent implements OnChanges, OnInit {
    @Input() message: string;
    @Input() url: string;
    @Input() action: string;
    @Input() type: string;
    @Input() show: boolean;

    variant: {
        class: string;
        icon: string;
    };

    ngOnInit() {
        this._determineVariant(this.type);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['type']) {                        
            this._determineVariant(changes['type'].currentValue);
        }
    }

    dismiss() {
        this.show = false;
    }

    private _determineVariant(type: string) {
        switch (type) {
            case 'Error':
                this.variant = { class: "ms-MessageBar--error", icon: "ms-Icon--xCircle" };
                break;

            case 'Remove':
                this.variant = { class: "ms-MessageBar--remove", icon: "ms-Icon--minus ms-Icon--circle" };
                break;

            case 'Severe':
                this.variant = { class: "ms-MessageBar--severeWarning", icon: "ms-Icon--alert" };
                break;

            case 'Success':
                this.variant = { class: "ms-MessageBar--success", icon: "ms-Icon--checkboxCheck ms-Icon--circle" };
                break;

            case 'Warning':
                this.variant = { class: "ms-MessageBar--warning", icon: "ms-Icon--infoCircle" };
                break;

            case 'Info':
            default:
                this.variant = { class: "", icon: "ms-Icon--infoCircle" };
                break;
        }
    }
}