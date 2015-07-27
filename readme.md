# Fitbit-Node

An API client library written for Fitbit in NodeJS.

## Usage
1. `npm install fitbit-node`
1. (In your JS file) `var FitbitApiClient = require("fitbit-node");`

## API

#### `new FitbitApiClient(consumerKey, consumerSecret)`
Constructor. Use the `consumerKey` and `consumerSecret` provided to you when you registered your app on [dev.fitbit.com](http://dev.fitbit.com/).

#### `getRequestToken()`
Get a request token. This is the first step of the OAuth flow. Returns a promise. When this promise is resolved with a request token, forward the user to the Fitbit site (e.g., http://www.fitbit.com/oauth/authorize?oauth_token=<requestToken>) for authentication. (You can substitute "authenticate" instead of "authorize" in the URL if you do not wish to forward to the Fitbit site for authentication next time you request an access token.)

#### `getAccessToken(requestToken, requestTokenSecret, verifier)`
After the user authorizes with Fitbit, he/she will be forwarded to the URL you specify in your Fitbit API application settings, and the `requestToken` and `verifier` will be in the URL. Use these, along with the `requestTokenSecret` you received above to request an access token in order to make API calls. Returns a promise.

#### `get(url, accessToken, accessTokenSecret, [userId])`
Make a GET API call to the Fitbit servers. (See [example.js](https://github.com/lukasolson/fitbit-node/blob/master/example.js) for an example.) Returns a promise.

#### `post(url, accessToken, accessTokenSecret, data, [userId])`
Make a POST API call to the Fitbit servers. Returns a promise.

#### `put(url, accessToken, accessTokenSecret, data, [userId])`
Make a PUT API call to the Fitbit servers. Returns a promise.

#### `delete(url, accessToken, accessTokenSecret, [userId])`
Make a DELETE API call to the Fitbit servers. Returns a promise.