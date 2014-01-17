var express = require("express"),
	app = express();

var FitbitClient = require("./fitbit-client"),
	client = new FitbitClient("4aa1a1175b514e6fb15c3f92d5cfaab3", "4ac101158b93458bae083b1b899c2293");

var requestToken, requestTokenSecret;

app.get("/authorize", function (req, res) {
	client.getRequestToken().then(function (results) {
		requestToken = results[0];
		requestTokenSecret = results[1];
		res.redirect("http://www.fitbit.com/oauth/authorize?oauth_token=" + requestToken);
	});
});

app.get("/authorize-callback", function (req, res) {
	client.getAccessToken(requestToken, requestTokenSecret, req.query.oauth_verifier).then(function (results) {
		var accessToken = results[0],
			accessTokenSecret = results[1],
			userId = results[2].encoded_user_id;

		client.requestResource("/profile.json", "GET", accessToken, accessTokenSecret).then(function (results) {
			var response = results[0];
			res.send(response);
		}, function (error) {
			res.send(error);
		});
	});
});

app.listen(1024);