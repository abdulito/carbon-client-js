var request = require('request');
var util = require('util');
var EJSON = require('mongodb-extended-json')
var Endpoint = require('./Endpoint')
var syncInvoke = require('fibers-utils').syncInvoke


/******************************************************************************
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

}

util.inherits(RestClient, Endpoint)

/****************************************************************************************************
 * exports
 */
module.exports = RestClient
