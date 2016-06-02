import {Utils} from '../helpers/utilities';
import {StorageHelper} from '../helpers/storage.helper';
declare var fabric: any;

class AuthorizeService {
    private _component;
    private static CLIENT_ID = "53c1eb0d00a1ef6bf9ce";
    private static REDIRECT_URI = window.location.protocol + "//" + window.location.host + "/authorize.html";
    private static SCOPE = "repo";

    constructor() { }

    getToken() {
        if (!Utils.isWord) return;

        var context = Office.context as any;
        try {
            var code = this._getCode();
            if (code == null) {
                window.location.replace(this._getUrl());
                return;
            };

            var url = Utils.replace("https://githubproxy.azurewebsites.net/api/GetToken?code=@authCode&gcode=@gCode&redirect_uri=@redirect_uri")
                ("@authCode", "ihzktpmvosba18j24p0o6m9gmj8wgdaubdtc")
                ("@gCode", code)
                ("@redirect_uri", AuthorizeService.REDIRECT_URI)
                ();

            $.get(url).then(
                response => {
                    var token = this._extractToken(response);
                    context.ui.messageParent(JSON.stringify(token));
                },
                error => context.ui.messageParent(JSON.stringify(error))
            );
        }
        catch (exception) {
            context.ui.messageParent(JSON.stringify(exception));
        }
    }

    private _getUrl() {
        var baseUrl = "https://github.com/login/oauth/authorize?client_id=@client_id&redirect_uri=@redirect_uri&scope=@scope";
        return Utils.replace(baseUrl)
            ('@client_id', AuthorizeService.CLIENT_ID)
            ('@redirect_uri', AuthorizeService.REDIRECT_URI)
            ('@scope', AuthorizeService.SCOPE)
            ();
    }

    private _getCode() {
        let params: any = {},
            regex = /code=(.*$)/gi,
            path = window.location.href;

        var code = regex.exec(path);
        return Utils.isEmpty(code) ? null : code[1];
    }

    private _extractToken(source: string) {
        let params: any = {},
            regex = /([a-z_]*?)=(.*?)(?:$|&)/gmi,
            matches;

        while ((matches = regex.exec(source)) != null) {
            params[matches[1]] = matches[2];
        }

        return params;
    }
}

$(document).ready(() => { new AuthorizeService().getToken(); });