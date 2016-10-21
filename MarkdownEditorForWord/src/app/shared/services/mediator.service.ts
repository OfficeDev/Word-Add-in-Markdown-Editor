import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';
import { Authenticator, Dictionary, IToken } from '@microsoft/office-js-helpers';
import { Utilities } from '../helpers';

export interface IChannel {
    name: string,
    source$: Observable<any>
}

export interface IEventChannel extends IChannel {
    source: EventEmitter<any>
}

export interface ISubjectChannel extends IChannel {
    source: Subject<any>
}

@Injectable()
export class MediatorService extends Dictionary<IChannel> implements OnDestroy {
    constructor() {
        super();
    }

    createEventChannel<T>(name: string): IEventChannel {
        var current = this.get(name);
        if (!Utilities.isNull(current)) return current as IEventChannel;

        var event = new EventEmitter<T>();
        return this.add(name, { name: name, source$: event.asObservable(), source: event } as IChannel) as IEventChannel;
    }

    createSubjectChannel<T>(name: string): ISubjectChannel {
        var current = this.get(name);
        if (!Utilities.isNull(current)) return current as ISubjectChannel;

        var dataSource = new Subject<T>();
        var event = dataSource.asObservable();
        return this.add(name, { name: name, source$: event, source: dataSource } as IChannel) as ISubjectChannel;
    }

    clear() {
        _.each(this.values(), subscription => {
            (<IEventChannel | ISubjectChannel>(subscription)).source.unsubscribe();
        });

        super.clear();
    }

    ngOnDestroy() {
        this.clear();
    }
}