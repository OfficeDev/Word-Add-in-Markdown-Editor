import {Component, OnDestroy} from '@angular/core';
import {BaseComponent} from '../base.component';
import {MediatorService, IEventChannel, IMessage, MessageType} from '../../shared/services';

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
                {{message.message}}<br>
                <div class="ms-MessageBar__actions--row" *ngIf="message.action">
                    <button class="ms-Button ms-MessageBar__action ms-MessageBar__action--primary" (click)="yes()">{{message.action.yes}}</button>
                    <button class="ms-Button ms-MessageBar__action ms-MessageBar__action--secondary" (click)="no()">{{message.action.no}}</button>
                </div>                
            </div>
            <div class="mw-message-bar__icon" (click)="dismiss()">
                <i class="ms-Icon ms-Icon--x"></i>
            </div>
        </div>
    </div>`
})
export class MessageBarComponent extends BaseComponent implements OnDestroy {
    message: IMessage;
    isHidden = true;

    variant: {
        class: string;
        icon: string;
    };

    private _messageChannel: IEventChannel;

    constructor(private _mediatorService: MediatorService) {
        super();
        this._messageChannel = this._mediatorService.createEventChannel<IMessage>('toast-channel');
        var subscription = this._messageChannel.source$.debounce(200 as any).subscribe(toast => this.showMessage(toast));
        this.markDispose(subscription);
    }

    dismiss() {
        this.message = null;
        this.isHidden = true;
        if (this.message.action && this.message.action.dismissEvent) {
            this.message.action.dismissEvent.next('dismiss');
        }
    }

    showMessage(message: IMessage) {
        this.message = message;
        this._determineVariant(message.type);
        this.isHidden = false;
    }

    yes() {
        if (this.message.action && this.message.action.actionEvent) {
            this.message.action.actionEvent.next(true);
        }
    }

    no() {
        if (this.message.action && this.message.action.actionEvent) {
            this.message.action.actionEvent.next(false);
        }
    }

    private _determineVariant(type: MessageType) {
        switch (type) {
            case MessageType.Error:
                this.variant = { class: "ms-MessageBar--error", icon: "ms-Icon--xCircle" };
                break;

            case MessageType.Remove:
                this.variant = { class: "ms-MessageBar--remove", icon: "ms-Icon--minus ms-Icon--circle" };
                break;

            case MessageType.SevereWarning:
                this.variant = { class: "ms-MessageBar--severeWarning", icon: "ms-Icon--alert" };
                break;

            case MessageType.Success:
                this.variant = { class: "ms-MessageBar--success", icon: "ms-Icon--checkboxCheck ms-Icon--circle" };
                break;

            case MessageType.Warning:
                this.variant = { class: "ms-MessageBar--warning", icon: "ms-Icon--infoCircle" };
                break;

            case MessageType.Info:
            default:
                this.variant = { class: "", icon: "ms-Icon--infoCircle" };
                break;
        }
    }
}