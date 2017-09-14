var request = require('request')
var _ = require('lodash')

var ejson = require('@carbon-io/ejson')
var HttpErrors = require('@carbon-io/http-errors')

var Collection = require('./Collection')

DEFAULT_OPTIONS = {
  json: true,
  strictSSL: true
}

/***************************************************************************************************
 * @class Endpoint
 * @description This is a private class. Should not call Endpoint constructor directly,
 *              but should use RestClient.getEndpoint(path)
 * @memberof carbon-client
 */
function Endpoint() {
  /*****************************************************************************
   * @property {xxx} client -- xxx
   */
  this.client = null
  /*****************************************************************************
   * @property {string} path -- xxx
   */
  this.path = null
  /*****************************************************************************
   * @property {xxx} parent -- xxx
   */
  this.parent = null
  /*****************************************************************************
   * @property {xxx} endpoints -- xxx
   */
  this.endpoints = {}
}

/***************************************************************************************************
 * collection class class variable
 *
 * @static
 *
 * @type {Collection|*|exports}
 */

Endpoint.collectionClass = Collection

/***************************************************************************************************
 * @method getAbsolutePath
 * @description getAbsolutePath description
 * returns {xxx} -- xxx
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

/***************************************************************************************************
 * @method getFullUrl
 * @description getFullUrl description
 * @returns {xxx} -- xxx
 */
Endpoint.prototype.getFullUrl = function() {
  var absolutePath = this.getAbsolutePath()
  if (absolutePath === '/') {
    absolutePath = ''
  }
  return this.client.url + absolutePath
}

/***************************************************************************************************
 * @method getEndpoint
 * @description getEndpoint description
 * @param {string} path -- (i.e. 'foo' or 'foo/bar')
 * @returns {xxx}
 */
Endpoint.prototype.getEndpoint = function(path) {
  if (!path) {
    return null // XXX null or this?
  }

  var pathList = path.split('/')
  if (pathList.length === 0) { /// XXX null or this?
    return null
  }

  if (pathList[0] === '') {
    // means path started with '/' XXX maybe we should not trim here and go
    // rel to root?
    pathList.shift()
  }

  if (pathList[pathList.length - 1] === '') { // means path ended with '/'
    pathList.pop()
  }

  return this._getEndpointFromPathList(pathList)
}

/***************************************************************************************************
 * @method getCollection
 * @description getCollection description
 * @param {string} path -- xxx
 * @returns {xxx} -- xxx
 */
Endpoint.prototype.getCollection = function(path) {
  var result = undefined

  var endpoint = this.getEndpoint(path)
  if (endpoint) {
    result = new Collection(endpoint)
  }

  return result
}

/***************************************************************************************************
 * @method get
 * @description Supported calling forms:
 *              get(cb)
 *              get(options, cb
 * @param {Object} options -- (optional)
 * @param {Function} cb -- xxx
 * @returns {xxx} -- xxx
 */
Endpoint.prototype.get = function() {
  return this._performOperation('get', arguments)
}

/***************************************************************************************************
 * @method post
 * @description Supported calling forms:
 *              post(cb)
 *              post(body, cb)
 *              post(body, options, cb)
 * @param {xxx} body -- (optional)
 * @param {xxx} options -- (optional)
 * @param {xxx} cb -- xxx
 * @returns {xxx} -- xxx
 */
Endpoint.prototype.post = function() {
  return this._performOperation('post', arguments)
}

/***************************************************************************************************
 * @method put
 * @description Supported calling forms:
 *              put(cb)
 *              put(body, cb)
 *              put(body, options, cb)
 * @param {object} body -- (optional)
 * @param {object} options -- (optional)
 * @param {Function} cb -- xxx
 * @returns {xxx} -- xxx
 */
Endpoint.prototype.put = function() {
  return this._performOperation('put', arguments)
}

/***************************************************************************************************
 * @method patch
 * @description Supported calling forms:
 *              patch(cb)
 *              patch(body, cb)
 *              patch(body, options, cb)
 * @param {object} body -- (optional)
 * @param {object} options -- (optional)
 * @param {Function} cb -- xxx
 * @returns {xxx} -- xxx
 */
Endpoint.prototype.patch = function() {
  return this._performOperation('patch', arguments)
}

/***************************************************************************************************
 * @method delete
 * @description Supported calling forms:
 *              delete(cb)
 *              delete(options, cb)
 * @param {oject} options -- (optional)
 * @param {Function} cb -- xxx
 * @returns {xxx} -- xxx
 */
Endpoint.prototype.delete = function() {
  return this._performOperation('delete', arguments)
}

/***************************************************************************************************
 * @method head
 * @description Supported calling forms:
 *              head(cb)
 *              head(options, cb)
 * @param {object} options -- (optional)
 * @param {Function} cb -- xxx
 * @returns {xxx} -- xxx
 */
Endpoint.prototype.head = function() {
  return this._performOperation('head', arguments)
}

/***************************************************************************************************
 * @method options
 * @description Supported calling forms:
 *              options(cb)
 *              options(options, cb)
 * @param {object} options -- (optional)
 * @param {Function} cb -- xxx
 * @returns {xxx} -- xxx
 */
Endpoint.prototype.options = function() {
  return this._performOperation('options', arguments)
}

/***************************************************************************************************
 * @method httpError
 * @description xxx
 * @param {xxx} code -- xxx
 * @param {xxx} message -- xxx
 * @param {xxx} response -- xxx
 * @returns {xxx} -- xxx
 */
Endpoint.prototype.httpError = function(code, message, response) {
  var errorClass = HttpErrors.codes[code]
  if (!errorClass) {
    errorClass = Error
  }

  var error = new errorClass(message, response)
  return error
}

/***************************************************************************************************
 * @method  _performOperation
 * @description _performOperation description
 * @param {Function} method -- xxx
 * @param {object} operationArguments -- xxx
 * @returns {undefined} -- undefined
 */
Endpoint.prototype._performOperation = function(method, operationArguments) {
  var body = undefined
  var options = {}
  var cb = undefined

  // Figure out what the arguments are
  switch (operationArguments.length) {
    case 3:
      body = operationArguments[0]
      options = operationArguments[1]
      cb = operationArguments[2]
      break
    case 2:
      if (['post', 'put', 'patch'].indexOf(method.toLowerCase()) !== -1) {
        body = operationArguments[0]
      } else {
        options = operationArguments[0]
      }
      cb = operationArguments[1]
      break
    case 1:
      cb = operationArguments[0]
      break
    default:
  }

  // apply default options
  options = this._applyDefaultOptions(options)

  // use ejson to serialize body so that extended types are preserved
  if(options.json && body) {
    try {
      body = ejson.serialize(body)
    } catch(e) {
      // ignore
    }
  }

  var parameters = options.parameters || options.params
  // Execute the request
  var self = this
  // XXX should we allow the user to influence redirect behavior?
  request({
    url: this.getFullUrl(),
    method: method.toUpperCase(),
    // qs: note that we serialize the json parameters to avoid wrong type conversions on server-side
    // see https://github.com/ljharb/qs/issues/91
    qs: serializeJsonParams(parameters),
    body: body,
    json: options.json,
    headers: options.headers,
    strictSSL: options.strictSSL,
    cert: options.cert,
    key: options.key,
    ca: options.ca,
    forever: options.forever,
    timeout: options.timeout
  }, function(e, r, b) {
    // use ejson to deserialize response body
    if(options.json) {
      try {
        r.body = ejson.deserialize(r.body)
      } catch(e) {
        // ignore
      }
    }
    // redirects are handled by request, so no need to
    if (e) {
      var msg = e.message || JSON.stringify(e)
      cb(self.httpError(e.code, msg, r), r)
    } else if (r.statusCode >= 400) {
      var msg = r.body.message || _.isString(r.body) ? r.body : JSON.stringify(r.body)
      cb(self.httpError(r.statusCode, msg, r), r)
    } else {
      cb(null, r)
    }
  })
}

/***************************************************************************************************
 * @method _getEndpointFromPathList
 * @description _getEndpointFromPathList description
 * @param {object} pathList -- xxx
 * @returns {xxx} -- xxx
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

/***************************************************************************************************
 * @method _applyDefaultOptions
 * @description applies client's default options to the specified options
 * @param {object} options -- xxx
 * @returns {xxx} -- xxx
 */
Endpoint.prototype._applyDefaultOptions = function(options) {
  var mergedOptions = _.cloneDeep(options)
  var defaultOptions = _.cloneDeep(DEFAULT_OPTIONS)
  if (this.client) {
    mergedOptions = _.merge(defaultOptions,
      this.client.defaultOptions,
      mergedOptions)  // give preference to options passed
    // to `_performOperation`
  }

  return mergedOptions
}

/***************************************************************************************************
 * @method _getChild
 * @description _getChild description
 * @param {string} path -- xxx
 * @returns {xxx} -- xxx
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

/***************************************************************************************************
 * @method serializeJsonParams
 * @param {object} params -- xxx
 * @returns {object} -- a new object with params json values serialized as json strings
 *
 */
function serializeJsonParams(params) {

  var result = {}
  if (params) {
    for (var key in params) {
      if (_.isObject(params[key])) {
        result[key] = ejson.stringify(params[key])
      } else {
        result[key] = params[key]
      }
    }
  }

  return result
}

/******************************************************************************
 * exports
 */
module.exports = Endpoint

