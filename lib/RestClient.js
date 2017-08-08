
var util = require('util')
var Endpoint = require('./Endpoint')

/***************************************************************************************************
 * @class RestClient
 * @description RestClient description
 * @extends carbon-client.Endpoint
 * @memberof carbon-client
 */
function RestClient(url, options) { // XXX what are the options?
  // call super
  Endpoint.call(this)

  /*****************************************************************************
   * @property {string} url -- xxx
   */
  this.url = url
  // setting this.client = this !!! this is so that child endpoint get
  // this.client set properly when calling end
  /*****************************************************************************
   * @property {xxx} client -- xxx
   */
  this.client = this
  /*****************************************************************************
   * @property {object} defaultOptions -- xxx
   */
  this.defaultOptions = options || {}

  // setup authenticator
  if ("authentication" in this.defaultOptions) {
    this._setupAuthentication(this.defaultOptions["authentication"])
  }

  // allow accessing "request" module from this client
  this.request = require("request")
}

// inherit Endpoint
util.inherits(RestClient, Endpoint)

/***************************************************************************************************
 * @method _setupAuthentication()
 * @description _setupAuthentication description
 * @param {xxx} authentication -- xxx
 * @returns {undefined}
 */
RestClient.prototype._setupAuthentication = function(authentication) {
  switch (authentication.type) {
    case 'api-key':
      this._setupApiKeyAuthentication(authentication)
      break
    default:
      throw new Error('Unknown authentication type: ' + authentication.type)
  }
}

/***************************************************************************************************
 * @method _setupApiKeyAuthentication
 * @description _setupApiKeyAuthentication description
 * @param {xxx} authentication -- xxx
 * @throws {Error}
 * @returns {undefined}
 */
RestClient.prototype._setupApiKeyAuthentication = function(authentication) {
  var apiKeyParameterName = authentication.apiKeyParameterName || "API_KEY"
  var apiKeyLocation = authentication.apiKeyLocation || "header"

  switch (apiKeyLocation) {
    case 'header':
      if ( !this.defaultOptions.headers) {
        this.defaultOptions.headers = {}
      }
      this.defaultOptions.headers[apiKeyParameterName] = authentication.apiKey
      break
    case 'query':
      if ( !this.defaultOptions.parameters) {
        this.defaultOptions.parameters = {}
      }
      this.defaultOptions.parameters[apiKeyParameterName] = authentication.apiKey
      break
    default:
      throw Error("Unknown apiKeyLocation '" + apiKeyLocation + "'")
  }
}

/******************************************************************************
 * exports
 */
module.exports = RestClient
