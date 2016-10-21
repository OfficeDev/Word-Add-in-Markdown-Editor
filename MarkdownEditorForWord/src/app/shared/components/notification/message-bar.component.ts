import { Component, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { MediatorService, IEventChannel, IMessage, MessageType } from '../../services';
import './message-bar.component.scss';

@Component({
    selector: 'message-bar',
    template: `
    <div class="ms-MessageBar mw-message-bar" [ngClass]="variant?.class" [hidden]="isHidden">
        <div class="ms-MessageBar-content mw-message-bar__content">
            <div class="ms-MessageBar-icon">
                <i class="ms-Icon ms-Icon-large" [ngClass]="variant?.icon"></i>
            </div>
            <div class="ms-MessageBar-text mw-message-bar__message ms-font-m">
                <p>{{message?.message}}</p>
            </div>
            <div class="mw-message-bar__icon" (click)="dismiss()">
                <i class="ms-Icon ms-Icon--x"></i>
            </div>
        </div>
        <div class="mw-message-bar__actions--row" [hidden]="!message?.action">
            <button class="ms-Button mw-message-bar__action mw-message-bar__action--primary" [hidden]="!message?.action?.yes" (click)="yes()">{{message?.action?.yes}}</button>
            <button class="ms-Button mw-message-bar__action mw-message-bar__action--secondary" [hidden]="!message?.action?.no" (click)="no()">{{message?.action?.no}}</button>
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
        this._messageChannel = this._mediatorService.createEventChannel<IMessage>('message-channel');
        var subscription = this._messageChannel.source$.debounceTime(300).subscribe(message => this.showMessage(message));
        this.markDispose(subscription);
    }

    dismiss() {
        if (this.message.action && this.message.action.dismissEvent) {
            this.message.action.dismissEvent.next(null);
        }
        this.message = null;
        this.isHidden = true;
    }

    showMessage(message: IMessage) {
        this.message = message;
        this._determineVariant(message.type);
        this.isHidden = false;
    }

    yes() {
        if (this.message.action && this.message.action.actionEvent) {
            this.message.action.actionEvent.next(true);
            this.dismiss();
        }
    }

    no() {
        if (this.message.action && this.message.action.actionEvent) {
            this.message.action.actionEvent.next(false);
            this.dismiss();
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