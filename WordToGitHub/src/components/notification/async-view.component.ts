import {Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {BaseComponent} from '../base.component';
import {Utils} from '../../shared/helpers';

@Component({
    selector: 'async-view',
    templateUrl: './async-view.component.html'
})
export class AsyncViewComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() observable: any | Observable<any>;
    @Input() placeholder: string;
    @Input() loading: string;
    @Input() error: string;
    isLoading: boolean;
    showError: boolean;
    data: any;

    constructor() {
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
            error => this.showError = true,
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
            }
        )
    }

    get isEmpty() {
        return Utils.isEmpty(this.data);
    }
}