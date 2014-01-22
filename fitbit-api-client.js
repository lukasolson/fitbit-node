var OAuth = require("oauth").OAuth,
	Q = require("q");

function FitbitApiClient(consumerKey, consumerSecret) {
	this.oauth = new OAuth(
		"https://api.fitbit.com/oauth/request_token",
		"https://api.fitbit.com/oauth/access_token",
		consumerKey,
		consumerSecret,
		"1.0",
		null,
		"HMAC-SHA1"
	);
}

FitbitApiClient.prototype = {
	getRequestToken: function () {
		var deferred = Q.defer();
		this.oauth.getOAuthRequestToken(deferred.makeNodeResolver());
		return deferred.promise;
	},

	getAccessToken: function (requestToken, requestTokenSecret, verifier) {
		var deferred = Q.defer();
		this.oauth.getOAuthAccessToken(requestToken, requestTokenSecret, verifier, deferred.makeNodeResolver());
		return deferred.promise;
	},

	requestResource: function (url, method, accessToken, accessTokenSecret, userId) {
		var deferred = Q.defer();
		this.oauth.getProtectedResource(
			"https://api.fitbit.com/1/user/" + (userId || "-") + url,
			method,
			accessToken,
			accessTokenSecret,
			deferred.makeNodeResolver()
		);
		return deferred.promise;
	}
};

module.exports = FitbitApiClient;