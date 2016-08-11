import {Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {BaseComponent} from '../base.component';
import {Utils} from '../../shared/helpers';
import {NotificationService, MessageType} from '../../shared/services';

@Component({
    selector: 'async-view',
    templateUrl: './async-view.component.html',
    styleUrls: ['./async-view.component.scss']
})
export class AsyncViewComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {
    @Input() observable: any | Observable<any>;
    @Input() placeholder: string;
    @Input() loading: string;
    @Input() error: string;
    isLoading: boolean;
    showError: boolean;
    data: any;

    constructor(private _notificationService: NotificationService) {
        super();
    }

    ngOnInit() {
        this.isLoading = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        var observable = changes['observable'];
        if (Utils.isNull(observable) || Utils.isNull(observable.currentValue)) return;
        if (observable.currentValue instanceof Observable) this._subscribe();
        else if (observable.currentValue instanceof Promise) this._then();
        else {
            this.data = observable.currentValue;
            this.isLoading = false;
            this.showError = false;            
        }
    }

    private _subscribe() {
        var subscription = (this.observable as Observable<any>).subscribe(
            next => {
                this.data = next;
                this.showError = false;
            },
            error => {
                this.showError = true;
                this._notificationService.message(JSON.stringify(error), MessageType.Error);
            },
            () => this.isLoading = false
        )
        this.markDispose(subscription);
    }

    private _then() {
        (this.observable as Promise<any>).then(
            result => {
                this.data = result;
                this.showError = false;
                this.isLoading = false;
            },
            error => {
                this.showError = true;
                this.isLoading = false;
                this._notificationService.message(JSON.stringify(error), MessageType.Error);
            }
        )
    }

    get isEmpty() {
        return Utils.isEmpty(this.data);
    }
}