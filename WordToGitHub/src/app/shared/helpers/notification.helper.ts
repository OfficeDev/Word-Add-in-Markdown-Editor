import {Utils} from './';

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

    showToast = (toast: IToast) => this.toast = toast;

    showMessage = (message: IMessage) => this.banner = message;
}
