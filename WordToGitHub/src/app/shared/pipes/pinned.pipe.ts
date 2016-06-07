import {Pipe, PipeTransform} from '@angular/core';
import {IPinnable} from '../services/github.service';
import {Utils} from '../helpers/utilities';

@Pipe({
    name: 'pinned'
})

export class PinnedPipe implements PipeTransform {
    transform(array: IPinnable[]) {
        if (Utils.isEmpty(array)) return;

        return array.filter(item => !item.isPinned);
    }
}