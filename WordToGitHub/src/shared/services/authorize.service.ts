import {Utils} from '../helpers/utilities';

export class AuthorizeService {
    private static _status = $('#status');

    static getToken(): Promise<any> {
        var code = this._extractCode();

        if (Utils.isNull(code)) {
            this._status.text('No code was received from GitHub.');
            Office.context.ui.messageParent(JSON.stringify(new Error('No code was received from GitHub')));
            return;
        }

        this._status.text('Requesting token from GitHub.');

        return this._postJSON(code)
            .then(response => {
                this._status.text('Loading your GitHub profile.');
                Office.context.ui.messageParent(response);
                return response;
            })
            .catch(error => {
                this._status.text(error);
                Office.context.ui.messageParent(error);
            });
    }

    private static _postJSON(code) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://github-auth.azurewebsites.net/api/GetToken-Developer?code=ephd6fr1cpufyf0xp01vmquxrlhwyolxwzxspjm1foscrkvs4iz9da8asvn57z8zh34r5m6lxr');
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                }
                else if (xhr.status !== 200) {
                    reject('Request failed.  Returned status of ' + xhr.response);
                }
            };

            xhr.send(JSON.stringify({
                code: code
            }));
        });
    }

    private static _extractCode() {
        let params: any = {},
            regex = /code=(.*$)/gi,
            path = location.href;

        var code = regex.exec(path);
        return Utils.isEmpty(code) ? null : code[1];
    }
}