var __  = require('@carbon-io/fibers').__(module)
var _o  = require('@carbon-io/bond')._o(module)
var o   = require('@carbon-io/atom').o(module)
var carbond   = require('@carbon-io/carbond')



// util functions

/***************************************************************************************************
 * sleep
 * @param delay
 * @param cb
 */
function sleep(delay, cb) {
  setTimeout(cb, delay)
}


/***************************************************************************************************
 * sleepSync
 * @param delay
 */
function sleepSync(delay) {
  sleep.sync(delay)
}

/***************************************************************************************************
 * ServiceForMongoDBCollectionTests
 */
module.exports = o({
  _type: carbond.Service,

  port: 9088,
  verbosity: 'warn',

  dbUri:"mongodb://localhost:27017/carbon-client-tests",

  endpoints: {

    "get-test": o({
      _type: carbond.Endpoint,
      get: function(req) {
        return "GET"
      }
    }),

    "post-test": o({
      _type: carbond.Endpoint,
      post: function(req) {
        return "POST"
      }
    }),

    "put-test": o({
      _type: carbond.Endpoint,
      put: function(req) {
        return "PUT"
      }
    }),

    "patch-test": o({
      _type: carbond.Endpoint,
      patch: function(req) {
        return "PATCH"
      }
    }),

    "delete-test": o({
      _type: carbond.Endpoint,
      delete: function(req) {
        return "DELETE"
      }
    }),

    "head-test": o({
      _type: carbond.Endpoint,
      head: function(req) {
        return "HEAD"
      }
    }),

    "options-test": o({
      _type: carbond.Endpoint,
      options: function(req) {
        return "OPTIONS"
      }
    }),

    "201-test": o({
      _type: carbond.Endpoint,
      get: function(req, res) {
        res.status(201)
        return '201 http status code'
      }
    }),

    "response-headers-test": o({
      _type: carbond.Endpoint,
      get: function(req, res) {
        res.setHeader('carbon-client', 'cool')
        return 'response headers'
      }
    }),

    timeout: o({
      _type: carbond.Endpoint,
      get: function(req, res) {
        // sleep for 5 seconds
        sleepSync(5000)
        return {
          ok: 1
        }
      }
    }),

    // users collection
    users: o({
      _type: carbond.mongodb.MongoDBCollection,
      collection: 'users',
      enabled: {
        '*': true
      },

      idGenerator: o({ _type: carbond.ObjectIdGenerator, generateStrings: true }),

      schema: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          username: {type: 'string'}
        },
        additionalProperties: true,
        required: ['_id', 'username']
      }
    }),
    userlite: o({
      _type: carbond.mongodb.MongoDBCollection,
      collection: 'users',
      enabled: {
        '*': true
      },
      insertConfig: {
        returnsInsertedObjects: false
      },

      insertObjectConfig: {
        returnsInsertedObject: false
      },

      idGenerator: o({ _type: carbond.ObjectIdGenerator, generateStrings: true }),

      schema: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          username: {type: 'string'}
        },
        additionalProperties: true,
        required: ['_id', 'username']
      }
    }),


    "error": o({
      _type: carbond.Endpoint,
      get: function(req, res) {
        res.status(500)
        return "ERROR"
      }
    })
  }
})
