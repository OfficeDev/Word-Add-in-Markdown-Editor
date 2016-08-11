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
    url?: string;
    action?: IAction;
}

export interface IToast {
    toast: string;
    title: string;
}

export interface IAction {
    yes: string;
    no: string;
    actionEvent: EventEmitter<any>
    dismissEvent: EventEmitter<any>
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
        else this._messageChannel.source.emit(message);
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
