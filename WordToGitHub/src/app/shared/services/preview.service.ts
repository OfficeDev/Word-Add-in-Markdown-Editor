import {Utils, StorageHelper} from '../helpers';

class PreviewService {
    private _component: any;
    private _storage: StorageHelper<string>;

    constructor() {
        this._storage = new StorageHelper<string>('MarkdownPreview');
    }

    showPreview() {
        if (!Utils.isWord) return;
        var md = this._storage.get('preview');
        $('#spinnerContainer').hide();
        $('#previewContainer').show();
        $('#preview').text(md);
    }
}

$(document).ready(() => {
    var previewService = new PreviewService();
    previewService.showPreview();
});