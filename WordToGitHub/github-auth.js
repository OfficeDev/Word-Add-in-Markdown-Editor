var request = require('request');

module.exports = function (context, data) {
    context.log(data);
    if ('code' in data) {
        context.log('code: ' + data.code);
        request.post({
            url: 'https://github.com/login/oauth/access_token',
            json: {
                client_id: '<CLIENT ID HERE>',
                client_secret: '<CLIENT SECRET HERE>',
                redirect_uri: 'https://word-to-github.azurewebsites.net',
                code: data.code
            }
        }, function (err, httpResponse, body) {
            if (err) {
                context.log('error: ' + err);
                context.res = {
                    body: {
                        status: 500,
                        error: err
                    }
                }
            }
            else {
                context.log(body);
                context.res = { body: body };
            }

            context.done();
        });
    }
    else {
        context.res = {
            status: 400,
            body: { error: 'Please pass the GitHub code in the input object' }
        };

        context.done();
    }
}
