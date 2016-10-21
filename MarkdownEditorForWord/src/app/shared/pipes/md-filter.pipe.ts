import { Pipe, PipeTransform } from '@angular/core';
import { Utilities } from '../helpers';
import { IContents } from '../services';

@Pipe({
    name: 'mdfilter'
})

export class MDFilterPipe implements PipeTransform {
    transform(array: IContents[]) {
        if (Utilities.isEmpty(array)) return array;

        return array.filter(item => {
            var nameRegex = /^[^.]+\.md$/gm;
            if (item.type == 'dir') return true;
            else if (nameRegex.test(item.name)) return true;
        });
    }
}