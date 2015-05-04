/**
 * Created by abdul on 3/5/15.
 */

/***
 * Endpoint class
 * @constructor
 */

function Endpoint() {
  this.path = null;
  this.endpoints = {};
  this.parent = null;
  this.client = null;
}

/**
 * getEndpoint
 * @param path
 * @returns {*}
 */
Endpoint.prototype.getEndpoint = function(path){
  if (this.endpoints[path] == null){
    this.endpoints[path] = this.newEndpoint(path);
  }

  return this.endpoints[path];
};


Endpoint.prototype.get = function(params, options, cb){
  return this.client.requestEndpoint(this, "get", params, null, options, cb);
};

Endpoint.prototype.post = function(params, data, options, cb){
  return this.client.requestEndpoint(this, "post", params, data, options, cb);
};

Endpoint.prototype.getAbsolutePath = function(){

  if(this.parent != null && this.parent != this.client){
    return this.parent.getAbsolutePath() + "/" + this.path;
  }else{
    return this.path;
  }

};

Endpoint.prototype.getFullUrl = function(){
  return this.client.url + "/" + this.getAbsolutePath();
};

/*********** Helpers **********/

Endpoint.prototype.newEndpoint = function(path){
  var ep = new Endpoint();
  ep.path = path;
  ep.parent = this;
  ep.client = this.client;

  return ep;

};


/****************************************************************************************************
 * exports
 */
if (typeof exports != "undefined") {
  exports.Endpoint = Endpoint;
}