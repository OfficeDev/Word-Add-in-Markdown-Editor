import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../helpers';

@Pipe({
    name: 'safenames'
})

export class SafeNamesPipe implements PipeTransform {
    transform(name: string, dashed: boolean) {
        if (Utils.isEmpty(name)) return name;

        if (!!!dashed) {
            return name.replace(/-/g, ' ');
        }
        else {
            return name.replace(/\s/g, '-');
        }
    }
}