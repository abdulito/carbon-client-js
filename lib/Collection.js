
var Endpoint = require('./Endpoint')
var _ = require('lodash')

/***********************************************************************************************************************
 * @class Collection
 * @constructor
 *
 * A Collection is a wrapper around an Endpoint that exposes a higher-level 
 * set of methods that abstracts the endpoint as a resource collection. 
 *
 * Abstract interface
   insert: function(obj, cb) {},
   find: function(query, options, cb) {},
   update: function(query, update, options, cb) {},
   remove: function(query, cb) {},
   findObject: function(id, cb) {},
   saveObject: function(object, cb) {},
   updateObject: function(id, update, cb) {},
   removeObject: function(id, cb) {}
 */
function Collection(endpoint) {
  this.endpoint = endpoint
}

/***********************************************************************************************************************
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
 * @return Cursor
 */
Collection.prototype.find = function() {
  return new Cursor(this, arguments)
}

/***********************************************************************************************************************
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
  if (options.projection) {
    params.projection = options.projection
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

/***********************************************************************************************************************
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
    cb(err, res ? res.body: undefined)
  })
}

/***********************************************************************************************************************
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
    cb(err, res && res.body)
  })
}

/***********************************************************************************************************************
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


/***********************************************************************************************************************
 * removeObject
 *
 * @param {Object} id
 * @param {Function} cb
 *
 */
Collection.prototype.removeObject = function(id, cb) {

  return this.endpoint.getEndpoint(id).delete({}, {}, function(err, res) {
    cb(err, res.body)
  })
}


/***********************************************************************************************************************
 * findObject
 *
 * @param {Object} id
 * @param {Function} cb
 *
 * Supported calling forms:
 *   findObject(id, cb)
 */
Collection.prototype.findObject = function(id, cb) {
  if(!id || !cb) {
    throw new Error("Must supply an id and a cb.")
  }

  return this.endpoint.getEndpoint(id).get({}, function(err, res) {
    cb(err, res ? res.body : null)
  })
}

/***********************************************************************************************************************
 * saveObject
 *
 * @param {Object} id
 * @param {Object} obj
 * @param {Function} cb
 *
 * Supported calling forms:
 *   saveObject(id, obj, cb)
 */
Collection.prototype.saveObject = function(id, obj, cb) {
  if(!id || !cb || !obj) {
    throw new Error("Must supply id, obj and cb.")
  }

  return this.endpoint.getEndpoint(id).put(obj, function(err, res) {
    cb(err, res ? res.body : null)
  })
}


/***********************************************************************************************************************
 * updateObject
 *
 * @param {Object} id
 * @param {Object} update
 * @param {Function} cb
 *
 * Supported calling forms:
 *   updateObject(id, update, cb)
 */
Collection.prototype.updateObject = function(id, update, cb) {
  if(!id || !cb || !obj) {
    throw new Error("Must supply id, obj and cb.")
  }

  return this.endpoint.getEndpoint(id).patch(update, function(err, res) {
    cb(err, res ? res.body : null)
  })
}


/***********************************************************************************************************************
 * @class Cursor
 * @constructor
 *
 * A Cursor is a cursor object returned by Collection.find() method and used for iterating over
 * results from find()
 * Abstract interface
    each: function(cb) {},
    next: function(cb) {},
    toArray: function(cb) {}


 **** How it works:
 - When you call collection.find() this will only construct a Cursor object without any data being loaded yet.
   Data will be loaded when its requested, which is either by the each(), toArray(), or the next() methods.

 - Data is loaded in batches. This is implemented through paginating the server-side Carbon Collection by passing
   skip/limit options of. Default batch size is 100 (Cursor.bufferLimit).

 - If a "limit" option was passed to the find() method option, then there will be one batch which contain "limit"
    number of items

 - Cursor object holds on to the current loaded batch (Cursor.items) and holds on the next cursor position
 (Cursor.nextItemPos). When next() called, then it will return Cursor.items[nextItemPos] and increment nextItemPos.

 - When the current page finishes, then a new page is loaded and so on until the Cursor._needToGetMore() returns false

 - toArray(): returns an array of items contain items of next() until end. So items that have already been fetched
 through next() won't be returned in toArray(). e.g.
  collection has ['a', 'b', 'c']
  calling
    cursor = collection.find()
   cursor.next() returns 'a'
   calling cursor.toArray() after returns ['b', 'c']


 */
function Cursor(collection, findArguments) {
  // the collection object
  this.collection = collection
  this.findArguments = parseFindArgs(findArguments)

  // limit for items to be fetched
  this.bufferLimit = 100
  // skip value to be applied when fetching the next batch
  this.bufferSkip = 0
  // current items fetched
  this.items = null

  // cursor's next item position within self.items
  this.nextItemPos = null
}

/***********************************************************************************************************************
 *
 * each
 * @param cb
 */
Cursor.prototype.each = function(cb) {

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
      } else {
        // make last call
        cb(null, null)
      }

    }

  }

  if (this._needToGetMore()) {
    this.getMore(callForeachItem)
  } else {
    callForeachItem()
  }
}

/***********************************************************************************************************************
 * toArray
 * @param cb
 */
Cursor.prototype.toArray = function(cb) {

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
  if (this._needToGetMore()) {
    this.getMore(appendRemainingAndCallback, true)
  } else {
    cb(null, result)
  }

}

/***********************************************************************************************************************
 *
 * @param cb
 */
Cursor.prototype.next = function(cb) {

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
    nextCallback()
  }

}

/***********************************************************************************************************************
 *
 * @param cb
 * @param exhaust indicates whether to exhaust the cursor. defaults to false.
 */
Cursor.prototype.getMore = function(cb, exhaust) {

  var options = this._constructFindOptions(exhaust)

  var self = this

  this.collection._doFind(this.findArguments.query, options, function(e, data) {
    if (e) {
      cb(e)
    } else {
      self.items = data
      self.bufferSkip = self.bufferSkip + self.bufferLimit
      self.nextItemPos = 0
      cb()
    }
  })

}
/***********************************************************************************************************************
 *
 * @param exhaust
 * @returns {*}
 * @private
 */
Cursor.prototype._constructFindOptions = function(exhaust) {

  var options = _.cloneDeep(this.findArguments.options || {})

  if (!options.skip) {
    options.skip = this.bufferSkip
  }

  if (!options.limit && !exhaust) {
    options.limit = this.bufferLimit
  }

  return options
}

/***********************************************************************************************************************
 *
 * @private
 */
Cursor.prototype._nextObject = function() {
  if (this.items && this.nextItemPos < this.items.length) {
    var item = this.items[this.nextItemPos]
    this.nextItemPos++
    return item
  } else {
    return null
  }
}

/***********************************************************************************************************************
 *
 * @returns {boolean}
 * @private
 */
Cursor.prototype._needToGetMore = function() {
  return this.items == null|| (!this.findArguments.options.limit &&
    this.items.length == this.bufferLimit && this.nextItemPos >= this.items.length)
}

/***********************************************************************************************************************
 *
 * @param findArgs
 * @returns {{query: undefined, options: {}, cb: undefined}}
 */
function parseFindArgs(findArgs) {
  var query = undefined
  var options = {}

  if (findArgs.length === 1) {
    query = findArgs[0]
  } else if (findArgs.length === 2) {
    query = findArgs[0]
    options = findArgs[1]
  }

  return {
    query: query,
    options: options
  }
}

Collection.cursorClass = Cursor

/***********************************************************************************************************************
 * exports
 */
module.exports = Collection

