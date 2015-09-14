var request = require('request')
var Endpoint = require('./Endpoint')
var HttpErrors = require('http-errors')

/******************************************************************************
 * @class Collection
 * @constructor
 *
 * A Collection is a wrapper around an Endpoint that exposes a higher-level 
 * set of methods that abstracts the endpoint as a resource collection. 
 *
 */
function Collection(endpoint) {
  this.endpoint = endpoint
}

/**********************************************************************
 * find
 *
 * @param {Object} query (optional)
 * @param {Object} options (optional)
 * @param {Function} cb
 * 
 * Supported calling forms:
 *   find(cb)
 *   find(query, cb)
 *   find(query, options, cb)
 */
Collection.prototype.find = function() {
  var query = undefined
  var options = {}
  var cb = undefined

  if (arguments.length === 1) {
    cb = arguments[0]
  } else if (arguments.length === 2) {
    query = arguments[0]
    cb = arguments[1]
  } else if (arguments.length === 3) {
    query = arguments[0]
    options = arguments[1]
    cb = arguments[2]
  }

  // Create proper get query parameters
  var params = {}
  if (query) {
    params.query = query
  }
  if (options.sort) { 
    params.sort = options.sort
  }
  if (options.fields) {
    params.fields = options.fields
  }
  if (options.skip) {
    params.skip = options.skip
  }
  if (options.limit) {
    params.limit = options.limit
  }

  return this.endpoint.get({ params: params }, function(err, res) {
//  return this.endpoint.get({}, function(err, res) {
//  return this.endpoint.get(function(err, res) {
    // XXX using same error for now but may want to abstract away HttpError
    cb(err, res ? res.body : null)
  })
}

/**********************************************************************
 * insert
 *
 * @param {Object} obj // XXX do we support arrays?
 * @param {Function} cb
 * 
 * Supported calling forms:
 *   insert(obj, cb)
 */
Collection.prototype.insert = function(obj, cb) {
  return this.endpoint.post(obj, {}, function(err, res) {
    // XXX using same error for now but may want to abstract away HttpError
    cb(err, res.body)
  })
}

/**********************************************************************
 * update
 *
 * @param {Object} query 
 * @param {Object} obj
 * @param {Object} options // XXX see leafnode 
 * @param {Function} cb
 * 
 * Supported calling forms:
 *   update(query, obj, cb)
 *   update(query, obj, options, cb)
 */
Collection.prototype.update = function() {
  var query = {}
  var obj = undefined
  var options = {}
  var cb = undefined
  
  if (arguments.length === 3) {
    query = arguments[0]
    obj = arguments[1]
    cb = arguments[2]
  } else if (arguments.length === 3) {
    query = arguments[0]
    obj = arguments[1]
    options = arguments[2]
    cb = arguments[3]
  } else {
    throw new Error("Must supply a query and an obj.")
  }
  
  return this.endpoint.put(query, {}, function(err, res) { // XXX put or patch depending on obj? Hmmm?
    // XXX using same error for now but may want to abstract away HttpError
    cb(err, res.body)
  })
}

/**********************************************************************
 * remove
 *
 * @param {Object} query 
 * @param {Object} options // XXX see leafnode 
 * @param {Function} cb
 * 
 * Supported calling forms:
 *   remove(query, cb)
 *   remove(query, options, cb)
 */
Collection.prototype.remove = function() {
  var query = {}
  var options = {}
  var cb = undefined
  
  if (arguments.length === 2) {
    query = arguments[0]
    cb = arguments[1]
  } else if (arguments.length === 3) {
    query = arguments[0]
    options = arguments[1]
    cb = arguments[2]
  } else {
    throw new Error("Must supply a query and a cb.")
  }
  
  return this.endpoint.delete(query, {}, function(err, res) {
    // XXX using same error for now but may want to abstract away HttpError
    cb(err, res.body)
  })
}

/**********************************************************************
 * exports
 */
module.exports = Collection

