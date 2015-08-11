var request = require('request');
var util = require('util');
var EJSON = require('mongodb-extended-json')
var Endpoint = require('./Endpoint')
var syncInvoke = require('fibers-utils').syncInvoke

/******************************************************************************
 * DEFAULT_OPTIONS
 */
var DEFAULT_OPTIONS = {
  // TODO
}

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
  this.options = options || DEFAULT_OPTIONS
}

util.inherits(RestClient, Endpoint)

/****************************************************************************************************
 * exports
 */
module.exports = RestClient
