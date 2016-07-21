import {Injectable, EventEmitter} from '@angular/core';
import {Utils, StorageHelper} from '../helpers';
import {Observable, Observer, Subscription} from 'rxjs/Rx';
import {MediatorService, IRepository, IEventChannel} from '../../shared/services';

@Injectable()
export class FavoritesService extends StorageHelper<IRepository> {
    pushDataEvent: IEventChannel;
    cache: StorageHelper<IRepository>;
    sub: Subscription;

    constructor(private _mediatorService: MediatorService) {
        super("FavoriteRepositories");
        this.pushDataEvent = this._mediatorService.createEventChannel<Event>('favorites');
    }

    pin(item: IRepository) {
        console.log('pin');        
        this.add(item.id.toString(), item);
        this.pushDataEvent.source.next(item);
    }

    unpin(item: IRepository) {
        console.log('unpin');
        this.remove(item.id.toString());
        this.pushDataEvent.source.next(item);
    }
}