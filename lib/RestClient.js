var request = require('request');
var util = require('util');
var EJSON = require('mongodb-extended-json')
var Endpoint = require('./Endpoint')

/**********************************************************************
 * @class RestClient < Endpoint
 * @constructor
 *
 * @param url
 * @param options
 */
function RestClient(url, options) { // XXX what are the options?
  // call super
  Endpoint.call(this)

  this.url = url
  // setting this.client = this !!! this is so that child endpoint get this.client set properly
  // when calling end
  this.client = this
  this.defaultOptions = options || {}

  // setup authenticator
  if ("authentication" in this.defaultOptions) {
    this._setupAuthentication(this.defaultOptions["authentication"])
  }
}

// inherit Endpoint
util.inherits(RestClient, Endpoint)

/******************************************************************************
 * _setupAuthentication()
 * @param authentication
 * @private
 */
RestClient.prototype._setupAuthentication = function(authentication) {
  if ( authentication.type === "api-key") {
    this._setupApiKeyAuthentication(authentication)
  }
}

/******************************************************************************
 * _setupApiKeyAuthentication
 * @param authentication
 * @private
 */
RestClient.prototype._setupApiKeyAuthentication = function(authentication) {
  var apiKeyParameterName = authentication.apiKeyParameterName || "API_KEY"
  var apiKeyLocation = authentication.apiKeyLocation || "header"

  if (apiKeyLocation === "header") {
    if ( !this.defaultOptions.headers) {
      this.defaultOptions.headers = {}
    }
    this.defaultOptions.headers[apiKeyParameterName] = authentication.apiKey
  } else if (apiKeyLocation === "query") {
    if ( !this.defaultOptions.params) {
      this.defaultOptions.params = {}
    }
    this.defaultOptions.params[apiKeyParameterName] = authentication.apiKey
  } else {
    throw Error("Unknown apiKeyLocation '" + apiKeyLocation + "'")
  }
}

/**********************************************************************
 * exports
 */
module.exports = RestClient
