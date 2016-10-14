import {Injectable, EventEmitter} from '@angular/core'
import {Utils} from '../helpers';
import {Observable} from 'rxjs/Rx';
import {MediatorService, IEventChannel} from '../services';

export enum MessageType {
    Info,
    Success,
    SevereWarning,
    Warning,
    Error,
    Remove
}

export interface IMessage {
    message: string;
    type: MessageType;
    action?: MessageAction;
}

export interface IToast {
    toast: string;
    title: string;
}

export class MessageAction {
    actionEvent: EventEmitter<any>
    dismissEvent: EventEmitter<any>

    constructor(public yes: string, public no?: string) {
        this.actionEvent = new EventEmitter<boolean>();
        this.dismissEvent = new EventEmitter();
    }
}

@Injectable()
export class NotificationService {
    private _toastChannel: IEventChannel;
    private _messageChannel: IEventChannel;

    constructor(private _mediatorService: MediatorService) {
        this._toastChannel = this._mediatorService.createEventChannel<IToast>('toast-channel');
        this._messageChannel = this._mediatorService.createEventChannel<IMessage>('message-channel');
    }

    message(message: string, type?: MessageType)
    message(message: IMessage)
    message(message: any, type?: any) {
        if (Utils.isEmpty(message)) return;
        if (_.isString(message)) {
            this._messageChannel.source.next({
                message: message,
                type: type
            });
        }
        else this._messageChannel.source.next(message);
    }

    error(message: string)
    error(message: any) {
        if (_.isString(message)) this.message(message, MessageType.Error);
        else this.message(JSON.stringify(message), MessageType.Error);
        Utils.error(JSON.stringify(message));
    }

    toast(toast: IToast)
    toast(toast: string, title?: string)
    toast(toast: any, title?: any) {
        if (Utils.isEmpty(toast)) return;
        if (_.isString(toast)) {
            this._toastChannel.source.next({
                toast: toast,
                title: title
            });
        }
        else this._toastChannel.source.next(toast);
    }
}
