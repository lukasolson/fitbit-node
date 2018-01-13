'use strict';
const OAuth2 = require('simple-oauth2').create;
const Request = require('request');

module.exports = class FitbitApiClient {
	constructor({clientId, clientSecret, apiVersion = '1.2'}) {
		this.apiVersion = apiVersion;
		this.oauth2 = OAuth2({
			client: {
				id: clientId,
				secret: clientSecret
			},
			auth: {
				tokenHost: 'https://api.fitbit.com/',
				tokenPath: 'oauth2/token',
				revokePath: 'oauth2/revoke',
				authorizeHost: 'https://api.fitbit.com/',
				authorizePath: 'oauth2/authorize'
			},
			options: {
				useBasicAuthorizationHeader: true
			}
		});
	}

	getUrl(path, userId){
		return `https://api.fitbit.com/${this.apiVersion}/user/${userId || '-'}${path}`;
	}

	mergeHeaders(accessToken, extraHeaders) {
		const headers = {
			Authorization: 'Bearer ' + accessToken
		};
		if (typeof extraHeaders !== "undefined" && extraHeaders) {
			for (let attr in extraHeaders) {
				if (extraHeaders.hasOwnProperty(attr)) {
					headers[attr] = extraHeaders[attr];
				}
			}
		}
		return headers;
	}

	getAuthorizeUrl(scope, redirectUrl, prompt, state) {
		return this.oauth2.authorizationCode.authorizeURL({
			scope: scope,
			redirect_uri: redirectUrl,
			prompt: prompt,
			state: state
		}).replace('api', 'www');
	}

	getAccessToken(code, redirectUrl) {
		return new Promise((resolve, reject) => {
			this.oauth2.authorizationCode.getToken({
				code: code,
				redirect_uri: redirectUrl
			}, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	}

	refreshAccessToken(accessToken, refreshToken, expiresIn) {
		return new Promise((resolve, reject) => {
			if (expiresIn === undefined) expiresIn = -1;
			const token = this.oauth2.accessToken.create({
				access_token: accessToken,
				refresh_token: refreshToken,
				expires_in: expiresIn
			});
			token.refresh((error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result.token);
				}
			});
		});
	}

	revokeAccessToken(accessToken) {
		return new Promise((resolve, reject) => {
			const token = this.oauth2.accessToken.create({
				access_token: accessToken,
				refresh_token: '',
				expires_in: ''
			});
			token.revoke('access_token', (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	}

	get(path, accessToken, userId, extraHeaders) {
		return new Promise((resolve, reject) => {
			Request({
				url: this.getUrl(path, userId),
				method: 'GET',
				headers: this.mergeHeaders(accessToken, extraHeaders),
				json: true
			}, (error, response, body) => {
				if (error) {
					reject(error);
				} else {
					resolve([
						body,
						response
					]);
				}
			});
		});
	}

	post(path, accessToken, data, userId, extraHeaders) {
		return new Promise((resolve, reject) => {
			Request({
				url: this.getUrl(path, userId),
				method: 'POST',
				headers: this.mergeHeaders(accessToken, extraHeaders),
				json: true,
				form: data
			}, (error, response, body) => {
				if (error) {
					reject(error);
				} else {
					resolve([
						body,
						response
					]);
				}
			});
		});
	}

	put(path, accessToken, data, userId, extraHeaders) {
		return new Promise((resolve, reject) => {
			Request({
				url: this.getUrl(path, userId),
				method: 'PUT',
				headers: this.mergeHeaders(accessToken, extraHeaders),
				json: true,
				form: data
			}, (error, response, body) => {
				if (error) {
					reject(error);
				} else {
					resolve([
						body,
						response
					]);
				}
			});
		});
	}

	delete(path, accessToken, userId, extraHeaders) {
		return new Promise((resolve, reject) => {
			Request({
				url: this.getUrl(path, userId),
				method: 'DELETE',
				headers: this.mergeHeaders(accessToken, extraHeaders),
				json: true
			}, (error, response, body) => {
				if (error) {
					reject(error);
				} else {
					resolve([
						body,
						response
					]);
				}
			});
		});
	}
};