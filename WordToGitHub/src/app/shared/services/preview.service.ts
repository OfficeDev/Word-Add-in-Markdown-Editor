import {Utils} from '../helpers/utilities';
import {StorageHelper} from '../helpers/storage.helper';
declare var fabric: any;

class PreviewService {
    private _component: any;
    private _storage: StorageHelper<string>;

    constructor(private _element) {
        this._component = new fabric['Spinner'](this._element);
        this._component.start();
        this._storage = new StorageHelper<string>('MarkdownPreview');
    }

    showPreview() {
        var md = this._storage.get('preview');
        $(this._element).text(md);
    }
}

$(document).ready(() => {
    var element = document.querySelector('#preview');
    var previewService = new PreviewService(element);
    previewService.showPreview();
});