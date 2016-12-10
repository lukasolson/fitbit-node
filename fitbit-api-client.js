var OAuth2 = require('simple-oauth2'),
    Q = require('q'),
    Request = require('request');

function FitbitApiClient(clientID, clientSecret) {
    this.oauth2 = OAuth2({
        clientID: clientID,
        clientSecret: clientSecret,
        site: 'https://api.fitbit.com/',
        authorizationPath: 'oauth2/authorize',
        tokenPath: 'oauth2/token',
        revocationPath: 'oauth2/revoke',
        useBasicAuthorizationHeader: true
    });
}

FitbitApiClient.prototype = {
    getAuthorizeUrl: function (scope, redirectUrl, prompt, state) {
        return this.oauth2.authCode.authorizeURL({
            scope: scope,
            redirect_uri: redirectUrl,
            prompt: prompt, 
            state: state
        }).replace('api', 'www');
    },

    getAccessToken: function (code, redirectUrl) {
        var deferred = Q.defer();

        this.oauth2.authCode.getToken({
            code: code,
            redirect_uri: redirectUrl
        }, function (error, result) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    },

    refreshAccessToken: function (accessToken, refreshToken, expiresIn) {
        if(expiresIn === undefined) expiresIn = -1;

        var deferred = Q.defer();

        var token = this.oauth2.accessToken.create({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn
        });

        token.refresh(function (error, result) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(result.token);
            }
        });

        return deferred.promise;
    },

    revokeAccessToken: function (accessToken) {
        var deferred = Q.defer();

        var token = this.oauth2.accessToken.create({
            access_token: accessToken,
            refresh_token: '',
            expires_in: ''
        });

        token.revoke('access_token', function (error, result) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    },

    // extraHeaders is optional
    get: function (path, accessToken, userId, extraHeaders) {
        var deferred = Q.defer();

        Request({
            url: getUrl(path, userId),
            method: 'GET',
            headers: mergeHeaders(accessToken, extraHeaders),
            json: true
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve([
                    body,
                    response
                ]);
            }
        });

        return deferred.promise;
    },

    // extraHeaders is optional
    post: function (path, accessToken, data, userId, extraHeaders) {
        var deferred = Q.defer();

        Request({
            url: getUrl(path, userId),
            method: 'POST',
            headers: mergeHeaders(accessToken, extraHeaders),
            json: true,
            form: data
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve([
                    body,
                    response
                ]);
            }
        });

        return deferred.promise;
    },

    // extraHeaders is optional
    put: function (path, accessToken, data, userId, extraHeaders) {
        var deferred = Q.defer();

        Request({
            url: getUrl(path, userId),
            method: 'PUT',
            headers: mergeHeaders(accessToken, extraHeaders),
            json: true,
            form: data
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve([
                    body,
                    response
                ]);
            }
        });

         return deferred.promise;
    },

    // extraHeaders is optional
    delete: function (path, accessToken, userId, extraHeaders) {
        var deferred = Q.defer();

        Request({
            url: getUrl(path, userId),
            method: 'DELETE',
            headers: mergeHeaders(accessToken, extraHeaders),
            json: true
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve([
                    body,
                    response
                ]);
            }
        });

        return deferred.promise;
    }
};

function getUrl(path, userId) {
    return path = 'https://api.fitbit.com/1/user/' + (userId || '-') + path;
}

function mergeHeaders(accessToken, extraHeaders) {
    var headers = {
        Authorization: 'Bearer ' + accessToken
    };

    if (typeof extraHeaders !== "undefined" && extraHeaders) {
      for (var attrname in extraHeaders) {
        headers[attrname] = extraHeaders[attrname];
      }
    }

    return headers;
}

module.exports = FitbitApiClient;
