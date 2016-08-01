﻿import {Utils} from '../helpers/utilities';

export class AuthorizeService {
    private _component;
    private static CLIENT_ID = "61ef07373b60f4f075cd";
    private static REDIRECT_URI = window.location.protocol + "//" + window.location.host + "/authorize.html";
    private static SCOPE = "repo";

    status = $('#status');

    constructor() { }

    getToken() {
        if (!Utils.isWord) return;

        var context = Office.context as any;
        try {
            var code = this._getCode();
            if (code == null) {
                this.status.text('Redirecting to Github');
                window.location.replace(this._getUrl());
                return;
            };
            this.status.text('Getting token');
            var url = Utils.replace("https://githubproxy.azurewebsites.net/api/GetToken-Developer?code=@authCode&gcode=@gCode&redirect_uri=@redirect_uri")
                ("@authCode", "vkybv91vgyefgta0xeadzz7bbk8sd3dozaz8")
                ("@gCode", code)
                ("@redirect_uri", AuthorizeService.REDIRECT_URI)
                ();

            $.get(url).then(
                response => {
                    this.status.text('Loading profile');
                    var token = this._extractToken(response);
                    context.ui.messageParent(JSON.stringify(token));
                },
                error => context.ui.messageParent(JSON.stringify(error))
            );
        }
        catch (exception) {
            this.status.text('Oops! Something went wrong.');
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