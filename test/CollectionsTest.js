var assert = require('assert')

var _ = require('lodash')

var __ = require('@carbon-io/fibers').__(module)
var o   = require('@carbon-io/atom').o(module)
var _o   = require('@carbon-io/bond')._o(module)
var testtube = require('@carbon-io/test-tube')

/******************************************************************************
 *
 */
__.main(function() {
  module.exports = o.main({

    /****************************************************************************
     * _type
     */
    _type: testtube.Test,

    /****************************************************************************
     * name
     */
    name: 'AsyncCollectionTest',

    /****************************************************************************
     * setup
     */
    setup: function(ctx) {
      ctx.global.usersCollection = require('./setup').getCollection('users')
    },

    /****************************************************************************
     * teardown
     */
    teardown: function(ctx) {
      delete ctx.global.usersCollection
    },

    /****************************************************************************
     *
     */
    tests: [
      o({
        _type: testtube.Test,
        name: 'FindToArrayTest',
        description: 'testing users collection async find toArray',
        doTest: function(ctx, done) {
          ctx.global.usersCollection.find().toArray(function(e, data) {
            var err = undefined
            try {
              assert(data != null)
              assert(e == null)
              assert(data.length > 0)
              assert(data[0].username === 'abdul')
              assert(data[1].username === 'bob')
            } catch (e) {
              err = e
            }
            return done(e)
          })
        }    
      }),
      o({
        _type: testtube.Test,
        name: 'LimitTest',
        description: 'testing users collection async find (limit:1)',
        doTest: function(ctx, done) {
          ctx.global.usersCollection.find(
            {}, {limit: 1}).toArray(function(e, data) {
              var err = undefined
              try {
                assert(data != null)
                assert(e == null)
                assert(data.length == 1)
                assert(data[0].username === 'abdul')
              } catch (e) {
                err = e
              }
              return done(err)
            })
        }    
      }),
      o({
        _type: testtube.Test,
        name: 'SkipResultTest',
        description: 'testing users collection async find (limit:1, skip:1)',
        doTest: function(ctx, done) {
          ctx.global.usersCollection.find(
            {}, {limit: 1, skip: 1}).toArray(function(e, data) {
              var err = undefined
              try {
                assert(data != null)
                assert(e == null)
                assert(data.length == 1)
                assert(data[0].username === 'bob')
              } catch (e) {
                err = e
              }
              return done(err)
            })
        }    
      }),
      o({
        _type: testtube.Test,
        name: 'CursorNextTest',
        description: 'testing cursor.next',
        setup: function(ctx) {
          ctx.global.cursor = ctx.global.usersCollection.find()
        },
        doTest: function(ctx, done) {
          ctx.global.cursor.next(function(e, obj) {
            var err = undefined
            try {
              assert(obj != null)
              assert(e == null)
              assert(obj.username === 'abdul')
            } catch (e) {
              err = e
            }
            return done(err)
          })
        }    
      }),
      o({
        _type: testtube.Test,
        name: 'CursorToArrayAfterNextTest',
        description: 'testing cursor.toArray() after next()',
        teardown: function(ctx) {
          delete ctx.global.cursor
        },
        doTest: function(ctx, done) {
          ctx.global.cursor.toArray(function(e, data) {
            var err = undefined
            try {
              assert(data != null)
              assert(e == null)
              assert(data.length == 1)
              assert(data[0].username === 'bob')
            } catch (e) {
              err = e
            }
            return done(err)
          })
        }    
      }),
      o({
        _type: testtube.Test,
        name: 'FindEachTest',
        description: 'testing find.each()',
        doTest: function(ctx, done) {
          var err = undefined
          ctx.global.usersCollection.find().each(function(e, item) {
            try {
              assert(_.isNull(e))
              if(!_.isNull(item)) {
                assert(item.username === 'abdul' || item.username === 'bob')
              } 
            } catch (e) {
              err = e
            }
            if (!_.isNil(e) || _.isNull(item)) {
              return done(err)
            }
          })
        }    
      }),
      o({
        _type: testtube.Test,
        name: 'InsertTest',
        description: 'testing users collection async insert',
        doTest: function(ctx, done) {
          ctx.global.usersCollection.insert({
              username: 'joe'
            }, function(e, result) {
              var err = undefined
              try {
                assert(_.isNull(e))
                assert(!_.isNull(result))
                assert(!_.isNull(result['_id']))
              } catch (e) {
                err = e
              }
              return done(err)
            }
          )
        }    
      }),
      o({
        _type: testtube.Test,
        name: 'RemoveTest',
        description: 'testing users collection async remove',
        doTest: function(ctx, done) {
          ctx.global.usersCollection.remove({
              username: 'joe'
            }, function(e, result) {
              var err = undefined
              try {
                assert(e == null)
                assert(result != null)
                assert(result.ok)
              } catch (e) {
                err = e
              }
              return done(err)
            }
          )
        }    
      }),
      o({
        _type: testtube.Test,
        name: 'RemoveObjectTest',
        description: 'testing users collection async removeObject',
        doTest: function(ctx, done) {
          ctx.global.usersCollection.removeObject('123',
            function(e, result) {
              var err = undefined
              try {
                assert(_.isNull(e))
                assert(_.isNull(result))
              } catch (e) {
                err = e
              }
              return done(err)
            }
          )
        }    
      }),
      o({
        _type: testtube.Test,
        name: 'UpdateTest',
        description: 'testing users collection async update',
        doTest: function(ctx, done) {
          ctx.global.usersCollection.update({
              username: 'joe'
            }, {
              '$set': {
                email: 'joe@foo.com'
              }
            }, function(e, result) {
              var err = undefined
              try {
                assert(_.isNull(e))
                assert(!_.isNull(result))
                assert(result.ok)
              } catch (e) {
                err = e
              }
              return done(err)
            })
        }    
      }),
      o({
        _type: testtube.Test,
        name: 'SaveObjectTest',
        description: 'testing users collection async saveObject',
        doTest: function(ctx, done) {
          ctx.global.usersCollection.saveObject('123', {
            username: 'joe'
          },
            function(e, result) {
              var err = undefined
              try {
                assert(_.isNull(e))
                assert(!_.isNull(result))
                assert.equal(result._id, '123')
              } catch (e) {
                err = e
              }
              return done(err)
            }
          )
        }    
      }),
      o({
        _type: testtube.Test,
        name: 'UpdateObjectTest',
        description: 'testing users collection async update object',
        doTest: function(ctx, done) {
          ctx.global.usersCollection.updateObject('123', {
              '$set': {
                email: 'joe@foo.com'
              }
            },
            function(e, result) {
              var err = undefined
              try {
                assert(_.isNull(e))
                assert(_.isNull(result))
              } catch (e) {
                err = e
              }
              return done(err)
            }
          )
        }    
      })
    ]
  })
})
