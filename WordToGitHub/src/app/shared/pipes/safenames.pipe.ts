import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../helpers';

@Pipe({
    name: 'safenames'
})

export class SafeNamesPipe implements PipeTransform {
    transform(name: string) {
        if (Utils.isEmpty(name)) return name;
        return name.replace(/-/g, ' ');
    }
}