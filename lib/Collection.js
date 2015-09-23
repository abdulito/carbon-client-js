var request = require('request')
var Endpoint = require('./Endpoint')
var HttpErrors = require('http-errors')

/**********************************************************************
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
 * 
 * Supported calling forms:
 *   find()
 *   find(query)
 *   find(query, options)
 *
 * @return CollectionCursor
 */
Collection.prototype.find = function() {
  return new CollectionCursor(this, arguments)
}

/**********************************************************************
 * _doFind
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
Collection.prototype._doFind = function() {
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
 * @class CollectionCursor
 * @constructor
 *
 * A CollectionCursor is a cursor object returned by Collection.find() method and used for iterating over
 * results from find()
 *
 */
function CollectionCursor(collection, findArguments) {
  this.collection = collection
  this.findArguments = parseFindArgs(findArguments)

  this.limit = 100
  this.skip = 0
  this.items = null
  this.nextItemPos = null
}

/**********************************************************************
 *
 * @param cb
 */
CollectionCursor.prototype.each = function(cb) {

  var self = this

  function callForeachItem(e) {
    if (e) {
      cb(e)
    } else {
      var item
      while ((item = self._nextObject()) != null) {
        cb(null, item)
      }

      if (self._needToGetMore()) {
        self.getMore(callForeachItem)
      }
    }

  }

  if (this._needToGetMore()) {
    this.getMore(callForeachItem)
  } else {
    callForeachItem()
  }
}

/**********************************************************************
 *
 * @param cb
 */
CollectionCursor.prototype.toArray = function(cb) {

  var self = this
  var result = []


  function appendRemaining() {
    var item
    while ((item = self._nextObject()) != null) {
      result.push(item)
    }

  }

  // append whats currently available
  appendRemaining()

  function appendRemainingAndCallback(e) {
    if (e) {
      cb(e)
      return
    }

    appendRemaining()

    cb(null, result)
  }

  // append whatever is currently available

  // fetch remaining and append it to the result
  this.limit = null
  if (this._needToGetMore()) {
    this.getMore(appendRemainingAndCallback)
  } else {
    cb(null, result)
  }

}

/**********************************************************************
 *
 * @param cb
 */
CollectionCursor.prototype.next = function(cb) {

  var self = this

  function nextCallback(e) {
    if (e) {
      cb(e)
    } else {
      cb(null, self._nextObject())
    }

  }

  if (this._needToGetMore()) {
    this.getMore(nextCallback)
  } else {
    nextCallback( null, this._nextObject())
  }

}

/**********************************************************************
 *
 * @param cb
 */
CollectionCursor.prototype.getMore = function(cb) {

  var options = {
    skip: this.skip * this.limit,
    limit: this.limit
  }

  var self = this
  this.collection._doFind(this.findArguments.query, options, function(e, data) {
    if (e) {
      cb(e)
    } else {
      self.items = data
      self.skip = self.skip + self.limit
      self.nextItemPos = 0
      cb()
    }
  })

}

/**********************************************************************
 *
 * @private
 */
CollectionCursor.prototype._nextObject = function() {
  if (this.items && this.nextItemPos in this.items) {
    var item = this.items[this.nextItemPos]
    this.nextItemPos++
    return item
  } else {
    return null
  }
}

/**********************************************************************
 *
 * @returns {boolean}
 * @private
 */
CollectionCursor.prototype._needToGetMore = function() {
  return !this._done()
}
/**********************************************************************
 *
 * @returns {null|*|boolean}
 * @private
 */
CollectionCursor.prototype._done = function() {
  return (this.items &&
          this.items.length > 0 &&
          this.items.length < this.limit &&
          !(this.nextItemPos in this.items))
}
/**********************************************************************
 *
 * @param findArgs
 * @returns {{query: undefined, options: {}, cb: undefined}}
 */
function parseFindArgs(findArgs) {
  var query = undefined
  var options = {}

  if (arguments.length === 1) {
    query = arguments[0]
  } else if (arguments.length === 2) {
    query = arguments[0]
    options = arguments[1]
  }

  return {
    query: query,
    options: options
  }
}

Collection.collectionCursorClass = CollectionCursor

/**********************************************************************
 * exports
 */
module.exports = Collection

