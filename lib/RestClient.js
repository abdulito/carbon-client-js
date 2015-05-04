/**
 * Created by abdul on 3/5/15.
 */
var request = require('request');
var util = require('util');
var Endpoint = require('./Endpoint').Endpoint;
var syncInvoke = require('fibers-utils').syncInvoke;


/***
 * CONSTS
 */

var DEFAULT_OPTIONS = {
  // TODO
}
/*************************
 * Class RestClient
 * @param url
 * @param options
 * @constructor
 */
function RestClient(url, options) {
  // call super
  Endpoint.call(this);

  this.url = url;
  // setting this.client = this !!! this is so that child endpoint get this.client set properly
  // when calling end
  this.client = this;
  this.options = options || DEFAULT_OPTIONS;
}

util.inherits(RestClient, Endpoint);

RestClient.prototype.requestEndpoint = function(endpoint, method, params, data, options, cb){
  return this.sendRequest({
    url: endpoint.getFullUrl(),
    method: method,
    params: params,
    data: data,
    options: options
  }, cb);
};

RestClient.prototype.sendRequest = function(
  args,
  cb){

  var url = args["url"];
  var method = args["method"] || "GET";
  var params = args["params"] || {};
  var data = args["data"] || {};


  // append api key
  if( this.apiKey != null) {
    if (method == "GET"){
      params["apiKey"] = this.apiKey;
    }else{
      data["apiKey"] = this.apiKey;
    }

  }

  // append params

  if(params && params.length > 0){
    url += "?";
    var count = 0;
    for (var paramName in params){
      if (count > 0) {
        url += "&";
      }
      url += paramName + "=" + params[paramName];
      count++;

    }
  }

  return this.doSendRequest(url, data, method, null, cb);

};

RestClient.prototype.doSendRequest = function(url, data, method, options, cb){
  var invokeMethodName = null;
  var args = [url];
  if( method === "get") {
    invokeMethodName = "get";
  }else if( method === "get") {
    invokeMethodName = "post";
    args.push(data);
  }

  args.push(options);

  return this.invokeRequestMethod(invokeMethodName, args, cb);

};

RestClient.prototype.invokeRequestMethod = function(methodName, args, cb){


  if(cb){
    args.push(function(err, res, body) {
      var data = JSON.parse(body);
      cb(err, res, data);
    });
    request[methodName].apply(request, args);
  }else{
    var result = syncInvoke(request, methodName, args);
    return JSON.parse(result.body);
  }

};
/****************************************************************************************************
 * exports
 */
if (typeof exports != "undefined") {
  exports.RestClient = RestClient;
}
