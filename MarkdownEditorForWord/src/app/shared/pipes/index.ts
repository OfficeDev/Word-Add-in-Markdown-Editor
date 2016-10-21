import { SafeNamesPipe } from './safenames.pipe';
import { MDFilterPipe } from './md-filter.pipe';

const PIPES = [
    SafeNamesPipe,
    MDFilterPipe
];

export { SafeNamesPipe, MDFilterPipe, PIPES };