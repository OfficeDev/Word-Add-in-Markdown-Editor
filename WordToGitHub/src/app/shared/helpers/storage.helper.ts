import {Repository, IRepository} from './repository';
import {Utils} from './utilities';

export enum StorageTypes {
    LocalStorage,
    SessionStorage
}

export class StorageHelper<T> extends Repository<T>{
    private _storage = null;

    constructor(private _container: string, type: StorageTypes = StorageTypes.LocalStorage) {
        super();
        this.switchStorage(type);
    }

    load() {
        let count = 0;
        super.clear();

        _.each(this._storage[this._container], (value: any, item: string) => {
            if (Utils.isNull(value)) return null;
            super.add(item, this._deserialize<T>(value));
            count++;
        });

        return count;
    }

    switchStorage(type: StorageTypes) {
        this._storage = type === StorageTypes.LocalStorage ? localStorage : sessionStorage;
        if (!_.has(this._storage, this._container)) {
            this._storage[this._container] = {};
        }

        let count = this.load();
        console.log('Loaded ' + count + ' ' + this._container);
    }

    add(item: string, value: T): T {
        if (Utils.isEmpty(item) || Utils.isNull(value)) return null;
        this._storage[this._container][item] = this._serialize(value);
        return super.add(item, value);
    }

    remove(item: string): T {
        if (Utils.isEmpty(this._storage[this._container])) return null;
        delete this._storage[this._container][item];
        return super.remove(item);
    }

    private _serialize(data: any): string {
        return JSON.stringify(data);
    }

    private _deserialize<T>(data: string): T {
        return JSON.parse(data) as T;
    }
}
