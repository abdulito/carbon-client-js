var request = require('request')
var _ = require('lodash')

var EJSON = require('mongodb-extended-json')
var HttpErrors = require('http-errors')

var Collection = require('./Collection')

DEFAULT_OPTIONS = {
  json: true, 
  strictSSL: true
}

/******************************************************************************
 * @class Endpoint
 * @constructor
 *
 * This is a private class. Should not call Endpoint constructor directly,
 * but should use RestClient.getEndpoint(path)
 */
function Endpoint() {
  this.client = null;
  this.path = null;
  this.parent = null;
  this.endpoints = {};
}

/**********************************************************************
 * collection class class variable
 *
 * @type {Collection|*|exports}
 */

Endpoint.collectionClass = Collection

/**********************************************************************
 * getAbsolutePath
 */
Endpoint.prototype.getAbsolutePath = function() {
  if (!this.parent) {
    return '/'
  }

  var parentPath = this.parent.getAbsolutePath()
  if (parentPath === '/') {
    parentPath = ''
  }

  return parentPath + '/' + (this.path ? this.path : '')
}

/**********************************************************************
 * getFullUrl
 */
Endpoint.prototype.getFullUrl = function() {
  var absolutePath = this.getAbsolutePath()
  if (absolutePath === '/') {
    absolutePath = ''
  }
  return this.client.url + absolutePath
}

/**********************************************************************
 * getEndpoint
 *
 * @param path - (i.e. 'foo' or 'foo/bar')
 * @returns {*}
 */
Endpoint.prototype.getEndpoint = function(path) {
  if (!path) {
    return null // XXX null or this?
  }

  var pathList = path.split('/')
  if (pathList.length === 0) { /// XXX null or this?
    return null
  }

  if (pathList[0] === '') { // means path started with '/' XXX maybe we should not trim here and go rel to root?
    pathList.shift()
  }

  if (pathList[pathList.length - 1] === '') { // means path ended with '/'
    pathList.pop()
  }

  return this._getEndpointFromPathList(pathList)
}

/**********************************************************************
 * getCollection
 */
Endpoint.prototype.getCollection = function(path) {
  var result = undefined

  var endpoint = this.getEndpoint(path)
  if (endpoint) {
    result = new Collection(endpoint)
  }

  return result
}

/**********************************************************************
 * get
 *
 * @param {Object} options (optional)
 * @param {Function} cb
 *
 * Supported calling forms:
 *   get(cb)
 *   get(options, cb)
 */
Endpoint.prototype.get = function() {
  return this._performOperation('get', arguments)
}

/**********************************************************************
 * post
 *
 * @param body (optional)
 * @param options (optional)
 * @param cb
 *
 * Supported calling forms:
 *   post(cb)
 *   post(body, cb)
 *   post(body, options, cb)
 */
Endpoint.prototype.post = function() {
  return this._performOperation('post', arguments)
}

/**********************************************************************
 * put
 *
 * @param body (optional)
 * @param options (optional)
 * @param cb
 *
 * Supported calling forms:
 *   put(cb)
 *   put(body, cb)
 *   put(body, options, cb)
 */
Endpoint.prototype.put = function() {
  return this._performOperation('put', arguments)
}

/**********************************************************************
 * patch
 *
 * @param body (optional)
 * @param options (optional)
 * @param cb
 *
 * Supported calling forms:
 *   patch(cb)
 *   patch(body, cb)
 *   patch(body, options, cb)
 */
Endpoint.prototype.patch = function() {
  return this._performOperation('patch', arguments)
}

/**********************************************************************
 * delete
 *
 * @param options (optional)
 * @param cb
 *
 * Supported calling forms:
 *   delete(cb)
 *   delete(options, cb)
 */
Endpoint.prototype.delete = function() {
  return this._performOperation('delete', arguments)
}

/**********************************************************************
 * head
 *
 * @param body (optional)
 * @param options (optional)
 * @param cb
 *
 * Supported calling forms:
 *   head(cb)
 *   head(options, cb)
 */
Endpoint.prototype.head = function() {
  return this._performOperation('head', arguments)
}

/**********************************************************************
 * options
 *
 * @param body (optional)
 * @param options (optional)
 * @param cb
 *
 * Supported calling forms:
 *   options(cb)
 *   options(options, cb)
 */
Endpoint.prototype.options = function() {
  return this._performOperation('options', arguments)
}

/**********************************************************************
 * httpError
 */
Endpoint.prototype.httpError = function(code, message) {
  var errorClass = this._getHttpErrorByCode(code)
  if (!errorClass) {
    errorClass = Error
  }

  var error = new errorClass(message)
  return error
}

/**********************************************************************
 * _performOperation
 */
Endpoint.prototype._performOperation = function(method, operationArguments) {
  var body = undefined
  var options = {}
  var cb = undefined

  // Figure out what the arguments are
  if (operationArguments.length === 1) {
    cb = operationArguments[0]
  } else if (operationArguments.length === 2) {
    // The case of two args differs per method. In post, put, and patch it is (body, cb).
    if (method === 'post' || method === 'put' || method === 'patch') {
      body = operationArguments[0]
    } else {
      options = operationArguments[0]
    }
    cb = operationArguments[1]
  } else if (operationArguments.length === 3) {
    body = operationArguments[0]
    options = operationArguments[1]
    cb = operationArguments[2]
  }

  // apply default options
  options = this._applyDefaultOptions(options)

  // Execute the request
  var self = this
  // XXX should we allow the user to influence redirect behavior?
  request({
    url: this.getFullUrl(),
    method: method.toUpperCase(),
    qs: options.params,
    body: body,
    json: options.json,
    headers: options.headers,
    strictSSL: options.strictSSL
  }, function(e, r, b) {
    // redirects are handled by request, so no need to
    if (e) {
      cb(self.httpError(e.code, e.message || e))
    } else if (r.statusCode >= 300) {
      // XXX note that the request module handles redirects, so if we get
      //     something >= 300 here, there was an issue. also note that we
      //     should not get 304's as request/carbon-client does not support
      //     conditional gets (afaik)
      cb(self.httpError(r.statusCode, r.body))
    } else {
      if (typeof(r.body) === 'object') { // both objects and arrays
        r.body = EJSON.deflate(r.body)
      }
      cb(null, r)
    }
  })
}

/**********************************************************************
 * _getEndpointFromPathList
 */
Endpoint.prototype._getEndpointFromPathList = function(pathList) {
  // get child Endpoint
  var child = this._getChild(pathList.shift())

  // recurse if there is path left
  if (pathList.length > 0) {
    return child._getEndpointFromPathList(pathList)
  } else {
    return child
  }
}

/**********************************************************************
 * _applyDefaultOptions
 * applies client's default options to the specified options
 *
 * @param options
 * @private
 */
Endpoint.prototype._applyDefaultOptions = function(options) {
  var mergedOptions = options;
  if (this.client) {
    mergedOptions = _.merge(DEFAULT_OPTIONS,
                            this.client.defaultOptions,
                            mergedOptions);  // give preference to options passed
                                             // to `_performOperation`
  }

  return mergedOptions;
}

/**********************************************************************
 * _getChild
 */
Endpoint.prototype._getChild = function(path) {
  if (!this.endpoints[path]) {
    var newEndpoint = new Endpoint()
    newEndpoint.path = path
    newEndpoint.parent = this
    newEndpoint.client = this.client

    this.endpoints[path] = newEndpoint
  }

  return this.endpoints[path]
}

/**********************************************************************
 * _httpErrorsByCode
 *
 * Attached to prototype and shared by all Endpoints
 */
Endpoint.prototype._httpErrorsByCode = {}

/**********************************************************************
 * _getHttpErrorByCode
 */
Endpoint.prototype._getHttpErrorByCode = function(code) {
  return this._httpErrorsByCode[code]
}

/**********************************************************************
 * static init
 */
for (var key in HttpErrors) {
  var e = HttpErrors[key]
  Endpoint.prototype._httpErrorsByCode[e.code] = e
}

/**********************************************************************
 * exports
 */
module.exports = Endpoint

