import {Injectable, EventEmitter} from '@angular/core';
import {Utils, StorageHelper} from '../helpers';
import {Observable, Observer} from 'rxjs/Rx';
import {MediatorService, IRepository, IEventChannel} from '../../shared/services';

@Injectable()
export class FavoritesService {
    pushDataEvent: IEventChannel;

    constructor(private _mediatorService: MediatorService) {
      this.pushDataEvent  = this._mediatorService.createEventChannel<Event>('favorites');
    }
     

    pushData(item: IRepository) {
        this.pushDataEvent.event.emit(item);
    }
}