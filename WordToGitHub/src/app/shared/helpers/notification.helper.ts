import {Utils} from './utilities';

export interface IProgress {
    isShown: boolean;
    message: string;
}

export class NotificationHelper {
    progress: IProgress;

    showProgress(promise: any, message: string) {
        if (Utils.isNull(promise) || Utils.isNull(promise.then)) return;

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
}
