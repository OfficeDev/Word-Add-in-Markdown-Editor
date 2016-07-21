import {Injectable, EventEmitter} from '@angular/core';
import {Subject, Observable} from 'rxjs/Rx';
import {Utils, Repository} from '../helpers';

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
export class MediatorService extends Repository<IChannel> {
    constructor() {
        super();
        this.data = {};
    }

    createEventChannel<T>(name: string): IEventChannel {
        var current = this.get(name);
        if (!Utils.isNull(current)) return current as IEventChannel;

        var event = new EventEmitter<T>();
        return this.add(name, { name: name, source$: event.asObservable(), source: event } as IChannel) as IEventChannel;
    }

    createSubjectChannel<T>(name: string): ISubjectChannel {
        var current = this.get(name);
        if (!Utils.isNull(current)) return current as ISubjectChannel;

        var dataSource = new Subject<T>();
        var event = dataSource.asObservable();
        return this.add(name, { name: name, source$: event, source: dataSource } as IChannel) as ISubjectChannel;
    }
}