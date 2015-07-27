var OAuth = require("oauth").OAuth,
	Promise = require("bluebird");

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
		var getRequestToken = Promise.promisify(this.oauth.getOAuthRequestToken, this.oauth);
		return getRequestToken();
	},

	getAccessToken: function (requestToken, requestTokenSecret, verifier) {
		var getAccessToken = Promise.promisify(this.oauth.getOAuthAccessToken, this.oauth);
		return getAccessToken(requestToken, requestTokenSecret, verifier);
	},
	
	get: function (path, accessToken, accessTokenSecret, userId) {
		var getResource = Promise.promisify(this.oauth.get, this.oauth);
		return getResource(getUrl(path, userId), accessToken, accessTokenSecret);
	},

	post: function (path, accessToken, accessTokenSecret, data, userId) {
		var postResource = Promise.promisify(this.oauth.post, this.oauth);
		return postResource(getUrl(path, userId), accessToken, accessTokenSecret, data);
	},

	put: function (path, accessToken, accessTokenSecret, data, userId) {
		var putResource = Promise.promisify(this.oauth.put, this.oauth);
		return putResource(getUrl(path, userId), accessToken, accessTokenSecret, data);
	},

	delete: function (path, accessToken, accessTokenSecret, userId) {
		var deleteResource = Promise.promisify(this.oauth.delete, this.oauth);
		return deleteResource(getUrl(path, userId), accessToken, accessTokenSecret);
	}
};

function getUrl(path, userId) {
	return url = "https://api.fitbit.com/1/user/" + (userId || "-") + path;
}

module.exports = FitbitApiClient;