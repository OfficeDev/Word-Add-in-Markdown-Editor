import {Injectable, EventEmitter} from '@angular/core';
import {Subject, Observable} from 'rxjs/Rx';
import {Utils, Repository} from '../helpers';

export interface IChannel {
    name: string,
    source$: Observable<any>,
    dataSource?: Subject<any>
}

@Injectable()
export class MediatorService extends Repository<IChannel> {
    constructor() {
        super();
        this.data = {};
    }

    createEvent<T>(name: string) {
        var current = this.get(name);
        if (!Utils.isNull(current)) return current;

        var event = new EventEmitter<T>().asObservable();
        return this.add(name, { name: name, source$: event });
    }

    createSubject<T>(name: string) {
        var current = this.get(name);
        if (!Utils.isNull(current)) return current;

        var dataSource = new Subject<T>();
        var event = dataSource.asObservable();
        return this.add(name, { name: name, source$: event, dataSource: dataSource });
    }
}