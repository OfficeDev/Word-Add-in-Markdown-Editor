import { Pipe, PipeTransform } from '@angular/core';
import { Utilities } from '../helpers';

@Pipe({
    name: 'safenames'
})

export class SafeNamesPipe implements PipeTransform {
    transform(name: string, dashed: boolean) {
        if (Utilities.isEmpty(name)) return name;

        if (!!!dashed) {
            return name.replace(/-/g, ' ');
        }
        else {
            return name.replace(/\s/g, '-');
        }
    }
}