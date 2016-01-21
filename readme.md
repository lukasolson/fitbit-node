# Fitbit-Node

An API client library written for Fitbit in NodeJS.

## Usage
1. `npm install fitbit-node`
1. (In your JS file) `var FitbitApiClient = require("fitbit-node");`

## API

#### `new FitbitApiClient(clientID, clientSecret)`
Constructor. Use the `clientID` and `clientSecret` provided to you when you registered your app on [dev.fitbit.com](http://dev.fitbit.com/).

#### `getAuthorizeUrl(scope, redirectUrl)`
Construct the authorization URL. This is the first step of the OAuth 2.0 flow. Returns a string. When this string containing the authorization URL on the Fitbit site is returned, redirect the user to that URL for authorization. The `scope` (a string of space-delimitted scope values you wish to obtain authorization for) and the `redirectUrl` (a string for the URL where you want Fitbit to redirect the user after authorization) are required. See the [Scope](https://dev.fitbit.com/docs/oauth2/#scope) section in Fitbit's API documentation for more details about possible scope values.

#### `getAccessToken(code, redirectUrl)`
After the user authorizes with Fitbit, he/she will be forwarded to the `redirectUrl` you specified when calling `getAuthorizationUrl()`, and the `code` will be present in the URL. Use this to exchange the authorization code for an access token in order to make API calls. Returns a promise.

#### `refreshAccesstoken(refreshToken)`
Refresh the user's access token, in the event that it has expired. The `refreshToken` would have been returned as `refresh_token` alongside the `access_token` by the `getAccessToken()` method. Returns a promise.

#### `get(path, accessToken, [userId])`
Make a GET API call to the Fitbit servers. (See [example.js](https://github.com/lukasolson/fitbit-node/blob/master/example.js) for an example.) Returns a promise.

#### `post(path, accessToken, data, [userId])`
Make a POST API call to the Fitbit servers. Returns a promise.

#### `put(path, accessToken, data, [userId])`
Make a PUT API call to the Fitbit servers. Returns a promise.

#### `delete(path, accessToken, [userId])`
Make a DELETE API call to the Fitbit servers. Returns a promise.
