var path = require('path').posix
var url = require('url')

var _ = require('lodash')
var ejson = require('@carbon-io/ejson')

var Endpoint = require('./Endpoint')

/***************************************************************************************************
 * @namespace carbon-client
 */

/***************************************************************************************************
 * @class Collection
 * @description A Collection is a wrapper around an Endpoint that exposes a higher-level
 *              set of methods that abstracts the endpoint as a resource collection.
 *
 *              Abstract interface
 *              insert: function(objects, options, cb) {},
 *              insertObject: function(obj, options, cb) {},
 *              find: function(options, cb) {},
 *              findObject: function(id, options, cb) {},
 *              update: function(update, options, cb) {},
 *              updateObject: function(id, update, options, cb) {},
 *              save: function(objects, options, cb) {},
 *              saveObject: function(object, options, cb) {},
 *              remove: function(options, cb) {},
 *              removeObject: function(id, options, cb) {}


 * @memberof carbon-client
 */
function Collection(endpoint, config) {
  this.endpoint = endpoint
  this.config = config
}

/******************************************************************************
 * @method find
 * @description Supported calling forms:
 *              find()
 *              find(options)
 * @param {Object} options -- (optional)
 * @returns {xxx} -- Cursor
 */
Collection.prototype.find = function() {
  return new Cursor(this, arguments)
}

/******************************************************************************
 * _doFind
 */
Collection.prototype._doFind = function(options, cb) {

  // return this.endpoint.get({}, function(err, res) {
  // return this.endpoint.get(function(err, res) {
  return this.endpoint.get(options, function(err, res) {
    // XXX using same error for now but may want to abstract away HttpError
    cb(err, res ? res.body : null)
  })
}

/***************************************************************************************************
 * @method insert
 * @description Supported calling forms:
 *              insert(objects, cb)
 *              insert(objects, options, cb)
 * @param {Array} objects --
 * @param {Object} options --
 * @param {Function} cb -- xxx
 * @returns {xxx} -- xxx
 */
Collection.prototype.insert = function() {
  var objects = arguments[0]
  var options = {}
  var cb = arguments[arguments.length - 1]

  if (arguments.length == 3) {
      options = arguments[1]
  }

  return this.endpoint.post(objects, options, function(err, res) {
    try {
      cb(err, res ? res.body : undefined)
    } catch (e) {
      cb(e)
    }
  })
}


/***************************************************************************************************
 * @method insertObject
 * @description Supported calling forms:
 *              insertObject(obj, cb)
 *              insertObject(obj, options, cb)
 * @param {Object} obj --
 * @param {Object} options --
 * @param {Function} cb -- xxx
 * @returns {xxx} -- xxx
 */
Collection.prototype.insertObject = function() {

  var obj = arguments[0]
  var options = {}
  var cb = arguments[arguments.length - 1]

  if (arguments.length == 3) {
    options = arguments[1]
  }
  if (_.isArray(obj)) {
    throw new Error('insertObject: obj cannot be an array. Use Collection.insert() instead.')
  }

  // delegate to to insert
  return this.insert([obj], options, function(e, result) {
    cb(e, result ? result[0] : undefined)
  })
}


/***************************************************************************************************
 * @method update
 * @description Supported calling forms:
 *              update(obj, cb)
 *              update(obj, options, cb)
 * @param {Object} obj -- xxx
 * @param {Object} options --
 * @param {Function} cb -- xxx
 * @throws {Error}
 * @returns {xxx} -- xxx
 */
Collection.prototype.update = function() {
  var obj = undefined
  var options = {}
  var cb = undefined

  switch (arguments.length) {
    case 3:
      options = arguments[1]
    case 2:
      obj = arguments[0]
      cb = arguments[arguments.length - 1]
      break
    default:
      throw new Error("Must supply a obj and cb")
  }

  var body = obj

  return this.endpoint.patch(body, options, function(err, res) { // XXX put or patch depending on obj? Hmmm?
    // XXX using same error for now but may want to abstract away HttpError
    cb(err, res && res.body)
  })
}

/***************************************************************************************************
 * @method remove
 * @description Supported calling forms:
 *              remove(cb)
 *              remove(options, cb)
 * @param {Object} options --
 * @param {Function} cb -- xxx
 * @throws {Error}
 * @returns {xxx} -- xxx
 */
Collection.prototype.remove = function() {
  var options = {}
  var cb = undefined

  switch (arguments.length) {
    case 2:
      options = arguments[0]
    case 1:
      cb = arguments[arguments.length - 1]
      break
    default:
      throw new Error("Must supply a cb.")
  }

  return this.endpoint.delete({}, options, function(err, res) {
    // XXX using same error for now but may want to abstract away HttpError
    cb(err, res && res.body)
  })
}


/***************************************************************************************************
 * @method removeObject
 * @description Supported calling forms:
 *              removeObject(id, cb)
 *              removeObject(id, options, cb)
 * @param {Object} id -- xxx
 * @param {Function} cb -- xxx
 * @param {Object} options -- xxx
 * @returns {xxx} -- xxx
 */
Collection.prototype.removeObject = function() {
  var id = arguments[0]
  var options = {}
  var cb = arguments[arguments.length - 1]

  if (arguments.length == 3) {
    options = arguments[1]
  }

  return this._getObjectEndpoint(id).delete({}, options, function(err, res) {
    cb(err, null)
  })
}


/***************************************************************************************************
 * @method findObject
 * @description Supported calling forms:
 *              findObject(id, cb)
 *              findObject(id, options, cb)
 * @param {Object} id -- xxx
 * @param {Object} options -- xxx
 * @param {Function} cb -- xxx
 * @throws {Error}
 * @returns {xxx} -- xxx
 */
Collection.prototype.findObject = function() {

  var id = arguments[0]
  var options = {}
  var cb = arguments[arguments.length - 1]

  if (arguments.length == 3) {
    options = arguments[1]
  }

  if(!id || !cb) {
    throw new Error("Must supply an id and a cb.")
  }

  return this._getObjectEndpoint(id).get(options, function(err, res) {
    cb(err, res ? res.body : null)
  })
}

/***************************************************************************************************
 * @method save
 * @description Supported calling forms:
 *              save(objects, cb)
 *              save(objects, options, cb)
 * @param {Array} objects -- xxx
 * @param {Object} options -- xxx
 * @param {Function} cb -- xxx
 * @throws {error}
 * @returns {xxx} -- xxx
 */
Collection.prototype.save = function() {
  var objects = arguments[0]
  var options = {}
  var cb = arguments[arguments.length - 1]

  if (arguments.length == 3) {
    options = arguments[1]
  }
  
  if (!_.isArray(objects)) {
    throw new Error("objects must be an Array")
  }

  return this.endpoint.put(objects, options, function(err, res) {
    try {
      cb(err, res ? res.body : undefined)
    } catch (e) {
      cb(e)
    }
  })
}


/***************************************************************************************************
 * @method saveObject
 * @description Supported calling forms:
 *              saveObject(id, obj, cb)
 * @param {Object} id --  xxx
 * @param {Object} obj -- xxx
 * @param {Object} options -- xxx
 * @param {Function} cb -- xxx
 * @throws {error}
 * @returns {xxx} -- xxx
 */
Collection.prototype.saveObject = function() {

  var id = arguments[0]
  var obj = arguments[1]
  var options = {}
  var cb = arguments[arguments.length - 1]

  if (arguments.length == 4) {
    options = arguments[2]
  }

  if(!id || !cb || !obj) {
    throw new Error("Must supply id, obj and cb.")
  }

  return this._getObjectEndpoint(id).put(obj, options, function(err, res) {
    try {
      cb(err, res ? res.body : undefined)
    } catch (e) {
      cb(e)
    }
  })
}


/***************************************************************************************************
 * @method updateObject
 * @description Supported calling forms:
 *              updateObject(id, update, cb)
 *              updateObject(id, update, options, cb)
 * @param {Object} id -- xxx
 * @param {Object} update -- xxx
 * @param {Object} options -- xxx
 * @param {Function} cb -- xxx
 * @throws {Error}
 * @returns {xxx} -- xxx
 */
Collection.prototype.updateObject = function() {
  var id = arguments[0]
  var update = arguments[1]
  var options = {}
  var cb = arguments[arguments.length - 1]

  if (arguments.length == 4) {
    options = arguments[2]
  }

  if(!id || !cb || !update) {
    throw new Error("Must supply id, update and cb.")
  }

  return this._getObjectEndpoint(id).patch(update, options, function(err, res) {
    cb(err, null)
  })
}

/***************************************************************************************************
 * @method _getObjectEndpoint()
 * @param {xxx} id -- xxx
 * @throws {Error}
 * @returns {xxx} -- xxx
 */
Collection.prototype._getObjectEndpoint = function(id) {
  var idPath = null

  if(_.isObject(id)) {
    if (id.$oid) {
      idPath = id.$oid
    } else if(id.toHexString) {
      idPath = id.toHexString()
    } else {
      throw Error("Invalid ObjectId: " + id)
    }
    if(!ejson.types.ObjectId.isValid(idPath)) {
      throw Error("Invalid ObjectId: " + id)
    }
  } else {
    idPath = id
  }

  return this.endpoint.getEndpoint(idPath)
}

/***************************************************************************************************
 * @class Cursor
 * @memberof carbon-client
 *
 * @description A Cursor is a cursor object returned by Collection.find() method and used for iterating over
 *              results from find()
 *              Abstract interface
 *                 each: function(cb) {},
 *                 next: function(cb) {},
 *                 toArray: function(cb) {}
 *
 *
 *               **** How it works:
 *              - When you call collection.find() this will only construct a Cursor object without any data being loaded yet.
 *                Data will be loaded when its requested, which is either by the each(), toArray(), or the next() methods.
 *
 *              - Data is loaded in batches. This is implemented through paginating the server-side Carbon Collection by passing
 *                skip/limit options of. Default batch size is 100 (Cursor.bufferLimit).
 *
 *              - If a "limit" option was passed to the find() method option, then there will be one batch which contain "limit"
 *                 number of items
 *
 *              - Cursor object holds on to the current loaded batch (Cursor.items) and holds on the next cursor position
 *              (Cursor.nextItemPos). When next() called, then it will return Cursor.items[nextItemPos] and increment nextItemPos.
 *
 *              - When the current page finishes, then a new page is loaded and so on until the Cursor._needToGetMore() returns false
 *
 *              - toArray(): returns an array of items contain items of next() until end. So items that have already been fetched
 *              through next() won't be returned in toArray(). e.g.
 *               collection has ['a', 'b', 'c']
 *               calling
 *                 cursor = collection.find()
 *                cursor.next() returns 'a'
 *                calling cursor.toArray() after returns ['b', 'c']
 *
 *
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

/***************************************************************************************************
 * @method forEach
 * @param {Function} iterator -- for processing each item
 * @param {Function} cb -- end callback
 * @returns {undefined} -- undefined
 */
Cursor.prototype.forEach = function(iterator, cb) {

  var self = this

  function callForeachItem(e) {
    if (e) {
      cb(e)
    } else {
      var item
      while ((item = self._nextObject()) != null) {
        iterator(item)
      }

      if (self._needToGetMore()) {
        self.getMore(callForeachItem)
      } else {
        // make last call
        cb(null)
      }

    }

  }

  if (this._needToGetMore()) {
    this.getMore(callForeachItem)
  } else {
    callForeachItem()
  }
}

/***************************************************************************************************
 * @method toArray
 * @param {Function} cb -- xxx
 * @returns {undefined} -- undefined
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

/***************************************************************************************************
 * @method next
 * @param {Function} cb -- xxx
 * @returns {undefined} -- undefined
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

/***************************************************************************************************
 *
 * @param val
 * @returns {carbon-client.Cursor}
 */
Cursor.prototype.skip = function(val) {
  if (!this.isPaginated()) {
    throw new Error("Cannot skip on an non-paginated collection")
  }

  this.bufferSkip = val
  return this
}

/***************************************************************************************************
 *
 * @param val
 * @returns {carbon-client.Cursor}
 */
Cursor.prototype.limit = function(val) {
  if (!this.isPaginated()) {
    throw new Error("Cannot limit on an non-paginated collection")
  }
  this.bufferLimit = val
  return this
}

Cursor.prototype.isPaginated = function() {
  return _.get(this.collection, "config.paginated")
}

/***************************************************************************************************
 * @method getMore
 * @param {Function} cb -- xxx
 * @param {xxx} exhaust -- indicates whether to exhaust the cursor. defaults to false.
 * @returns {undefined} -- undefined
 */
Cursor.prototype.getMore = function(cb, exhaust) {

  var options = this._constructFindOptions(exhaust)

  var self = this

  this.collection._doFind(options, function(e, data) {
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
/***************************************************************************************************
 * @method _constructFindOptions
 * @param {xxx} exhaust -- xxx
 * @returns {xxx} -- xxx
 */
Cursor.prototype._constructFindOptions = function(exhaust) {
  var options = _.cloneDeep(this.findArguments.options || {})
  _.set(options, "parameters.skip", this.bufferSkip)

  if (exhaust) {
    _.set(options, "parameters.limit", this.bufferLimit)
  }

  return options
}

/***************************************************************************************************
 * @method _nextObject
 * @returns {xxx} -- xxx
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

/***************************************************************************************************
 * @method _needToGetMore
 * @returns {boolean} -- xxx
 */
Cursor.prototype._needToGetMore = function() {
  return this.items == null|| (!_.get(this.findArguments.options, "parameters.limit") &&
    this.items.length == this.bufferLimit && this.nextItemPos >= this.items.length)
}

/***************************************************************************************************
 * @method parseFindArgs
 * @param {xxx} findArgs -- xxx
 * @returns {object} -- {options: {}, cb: undefined}
 */
function parseFindArgs(findArgs) {
  var options = {}

  if (findArgs.length == 1) {
    options = findArgs[0]
  }

  return {
    options: options
  }
}

Collection.cursorClass = Cursor

/***************************************************************************************************
 * exports
 */
module.exports = Collection

