import {Injectable, EventEmitter} from '@angular/core';
import {Utils, StorageHelper} from '../helpers';
import {Observable, Observer} from 'rxjs/Rx';
import {MediatorService, IRepository, IEventChannel} from '../../shared/services';

@Injectable()
export class FavoritesService {
    pushDataEvent = new EventEmitter<IRepository>();

    pushData(item: IRepository) {
        this.pushDataEvent.emit(item);
    }
}