import {Utils} from './';
import {Observable} from 'rxjs/Rx';

export interface IMessage {
    message: string;
    url?: string;
    action?: string;
    show?: boolean;
    type?: string;
}

export interface IToast {
    message: string;
    title: string;
    show: boolean;
}

export interface IProgress {
    isShown: boolean;
    message: string;
}

export class NotificationHelper {
    progress: IProgress;
    banner: IMessage;
    toast: IToast;

    showProgress(promise: any, message: string) {
        if (Utils.isNull(promise)) return;

        this.progress.isShown = true;
        this.progress.message = message || "Loading";

        return promise.then(
            success => {
                this.progress.isShown = false;
                return success;
            },
            error => {
                this.progress.isShown = false;
                return error;
            }
        ).catch(error => {
            this.progress.isShown = false;
            throw error;
        });
    }

    notify(message: string, type?: string)
    notify(message: IMessage)
    notify(message: any, type?: string) {
        if (Utils.isEmpty(message)) return;
        if (_.isString(message)) {
            this.banner = {
                message: message,
                show: true,
                type: type
            };
        }
        else this.banner = message;
    }

    showToast(message: IToast)
    showToast(message: string, title?: string)
    showToast(message: any, title?: any) {
        if (Utils.isEmpty(message)) return;
        if (_.isString(message)) {
            this.toast = {
                message: message,
                title: title,
                show: true
            };
        }
        else this.toast = message;
    }
}
