var assert = require('assert')

var _ = require('lodash')

var __ = require('@carbon-io/fibers').__(module)
var _o   = require('@carbon-io/bond')._o(module)
var o   = require('@carbon-io/atom').o(module)
var testtube = require('@carbon-io/test-tube')

/******************************************************************************
 *
 */
__(function() {
  module.exports = o.main({

    /****************************************************************************
     * _type
     */
    _type: _o("./TestBase"),

    /****************************************************************************
     * name
     */
    name: 'AsyncCollectionTest',


    /****************************************************************************
     *
     */
    tests: [
      o({
        _type: testtube.Test,
        name: 'FindToArrayTest',
        description: 'testing users collection async find toArray',
        doTest: function(ctx, done) {
          ctx.global.testClient.getCollection('users').find().toArray(function(e, data) {
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
          ctx.global.testClient.getCollection('users', {paginated: true}).find().limit(1).toArray(function(e, data) {
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
          ctx.global.testClient.getCollection('users', {paginated: true}).find().skip(1).limit(1).toArray(
            function(e, data) {
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
        name: 'ProjectionResultTest',
        description: 'testing users collection async find (projection)',
        doTest: function(ctx, done) {
          ctx.global.testClient.getCollection('users', {paginated: true}).find({
            parameters: {
              projection: {_id: 1, username: 1}}
          }).limit(1).toArray(function(e, data) {
            var err = undefined
            try {
              assert(data != null)
              assert(e == null)
              assert(data.length == 1)
              assert(_.keys(data[0]).length == 2)
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
          ctx.global.cursor = ctx.global.testClient.getCollection('users').find()
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
        description: 'testing find.forEach()',
        doTest: function(ctx, done) {
          ctx.global.testClient.getCollection('users').find().forEach(function(item) {
            assert(item.username === 'abdul' || item.username === 'bob')

          }, function(e) {
            assert(_.isNull(e))
            return done()
          })
        }
      }),
      o({
        _type: testtube.Test,
        name: 'InsertTest',
        description: 'testing users collection async insert',
        doTest: function(ctx, done) {
          ctx.global.testClient.getCollection('users').insert([{
              username: 'tim'
            }], function(e, result) {
              var err = undefined
              try {
                assert(_.isNull(e))
                assert(!_.isNull(result))
                assert(_.isArray(result))
                assert(!_.isNull(result[0]['_id']))
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
        name: 'InsertObjectTest',
        description: 'testing users collection async insertObject',
        doTest: function(ctx, done) {
          ctx.global.testClient.getCollection('users').insertObject({
              username: 'chris'
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
        name: 'UpdateTest',
        description: 'testing users collection async update',
        doTest: function(ctx, done) {
          ctx.global.testClient.getCollection('users').update({
            '$set': {
              lastLogin: new Date()
            }
          }, {
            parameters: {
              query: {
                username: 'abdul'
              }
            }
          }, function(e, result) {
            var err = undefined
            try {
              assert(_.isNull(e))
              assert(!_.isNull(result))
              assert(result.n == 1)
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
          ctx.global.testClient.getCollection('users').saveObject('777', {
            _id: "777",
            username: 'joe'
          },
            function(e, result) {
              var err = undefined
              try {
                assert(_.isNull(e))
                assert(!_.isNull(result))
                assert.equal(result._id, '777')
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
          ctx.global.testClient.getCollection('users').updateObject('123', {
              '$set': {
                lastLogin: new Date()
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
      }),

      o({
        _type: testtube.Test,
        name: 'RemoveTest',
        description: 'testing users collection async remove',
        doTest: function(ctx, done) {
          ctx.global.testClient.getCollection('users').remove({
            parameters: {
              query: {
                username: 'bob'
              }
            }}, function(e, result) {
              var err = undefined
              try {
                assert(e == null)
                assert(result != null)
                assert(result.n == 1)
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
          ctx.global.testClient.getCollection('users').removeObject('123',
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
        name: 'InsertLiteTest',
        description: 'testing users collection async insert with no body',
        doTest: function(ctx, done) {
          ctx.global.testClient.getCollection('userlite').insertObject({
              username: 'bill'
            }, function(e, result) {
              var err = undefined
              try {
                assert(_.isNull(e))
                assert(!_.isNull(result))
                assert(!_.isNull(result['_id']))
                assert.equal(result['username'], 'bill')
              } catch (e) {
                err = e
              }
              return done(err)
            }
          )
        }
      }),

      /*
       * IMPORTANT
       *  the save test was put last since save() replaces the whole collection.
       */
      o({
        _type: testtube.Test,
        name: 'SaveOTest',
        description: 'testing users collection async save',
        doTest: function(ctx, done) {
          ctx.global.testClient.getCollection('users').save([{
              _id: "777",
              username: 'joe'
            }],
            function(e, result) {
              var err = undefined
              try {
                assert(_.isNull(e))
                assert(!_.isNull(result))
                assert(_.isArray(result))
                assert(result.length == 1)
                assert.equal(result[0]._id, '777')
              } catch (e) {
                err = e
              }
              return done(err)
            }
          )
        }
      }),


    ]
  })
})
