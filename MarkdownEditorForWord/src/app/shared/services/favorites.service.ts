import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@microsoft/office-js-helpers';
import { Utilities } from '../helpers';
import { Observable, Observer, Subscription } from 'rxjs/Rx';
import { IRepository } from './models';
import { MediatorService, IEventChannel } from './mediator.service';

@Injectable()
export class FavoritesService extends Storage<IRepository> {
    pushDataEvent: IEventChannel;
    cache: Storage<IRepository>;
    sub: Subscription;

    constructor(private _mediatorService: MediatorService) {
        super("FavoriteRepositories");
        this.pushDataEvent = this._mediatorService.createEventChannel<Event>('favorites');
    }

    pin(item: IRepository) {
        this.add(item.id.toString(), item);
        this.pushDataEvent.source.next(item);
    }

    unpin(item: IRepository) {
        this.remove(item.id.toString());
        this.pushDataEvent.source.next(item);
    }
}