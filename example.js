var express = require("express"),
    app = express();

var FitbitApiClient = require("fitbit-node"),
    client = new FitbitApiClient("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET");

app.get("/authorize", function (req, res) {
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'YOUR_CALLBACK_URL'));
});

app.get("/callback", function (req, res) {
    client.getAccessToken(req.query.code, 'YOUR_CALLBACK_URL').then(function (result) {
        client.get("/profile.json", result.access_token).then(function (results) {
            res.send(results[0]);
        });
    }).catch(function (error) {
        res.send(error);
    });
});

app.listen(3000);
