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
    name: 'AsyncCursorTest',


    /****************************************************************************
     *
     */
    tests: [

      o({
        _type: testtube.Test,
        name: 'NoPaginationTest',
        description: 'testing non paginated collection',
        doTest: function(ctx, done) {
          var cursor = ctx.global.testClient.getCollection('items', {paginated: false}).find()

          cursor.toArray(function(e, data) {
            var err = undefined
            try {
              assert(data != null)
              assert(e == null)

              // since the collection is not paginated, we only get what the collection returns from the first fetch
              assert(data.length == 50)

            } catch (e) {
              err = e
            }
            return done(err)

          })
        }
      }),

      o({
        _type: testtube.Test,
        name: 'NoPaginationSkipTest',
        description: 'testing skip with non paginated collection',
        doTest: function(ctx, done) {
          var ex = null
          var err = undefined

          try {

            try {
              // test that skip is not allowed with non-paginated collections
              var cursor = ctx.global.testClient.getCollection('items', {paginated: false}).find().skip()
            } catch(e) {
              ex = e
            }
            assert(ex != null)
          } catch (e) {
            err = e
          }
          return done(err)
        }
      }),

      o({
        _type: testtube.Test,
        name: 'NoPaginationSkipParamTest',
        description: 'testing skip param with non paginated collection',
        doTest: function(ctx, done) {
          var ex = null
          var err = undefined

          try {

            try {
              // test that skip is not allowed with non-paginated collections
              var cursor = ctx.global.testClient.getCollection('items', {paginated: false}).find({
                parameters: {
                  skip: 1
                }
              })
            } catch(e) {
              ex = e
            }
            assert(ex != null)
          } catch (e) {
            err = e
          }
          return done(err)
        }
      }),

      o({
        _type: testtube.Test,
        name: 'NoPaginationLimitParamTest',
        description: 'testing limit param with non paginated collection',
        doTest: function(ctx, done) {
          var ex = null
          var err = undefined

          try {

            try {
              // test that skip is not allowed with non-paginated collections
              var cursor = ctx.global.testClient.getCollection('items', {paginated: false}).find({
                parameters: {
                  limit: 1
                }
              })
            } catch(e) {
              ex = e
            }
            assert(ex != null)
          } catch (e) {
            err = e
          }
          return done(err)
        }
      }),



      o({
        _type: testtube.Test,
        name: 'NoPaginationLimitTest',
        description: 'testing limit with non paginated collection',
        doTest: function(ctx, done) {
          var ex = null
          var err = undefined

          try {

            try {
              // test that skip is not allowed with non-paginated collections
              var cursor = ctx.global.testClient.getCollection('items', {paginated: false}).find().limit()
            } catch(e) {
              ex = e
            }
            assert(ex != null)
          } catch (e) {
            err = e
          }
          return done(err)
        }
      }),

      o({
        _type: testtube.Test,
        name: 'Cursor buffer',
        description: 'Testing cursor buffer max',
        doTest: function(ctx, done) {
          var cursor = ctx.global.testClient.getCollection('items', {paginated: true}).find()

          cursor.next(function(e, obj) {
            var err = undefined
            try {
              assert(obj != null)
              assert(cursor.items != null)
              assert(e == null)
              // confirm server-side collection has a max of 50 items per page, although client has 100
              assert(cursor.items.length == 50)
              // confirm that we still need more
              assert(cursor.needToGetMore())

            } catch (e) {
              err = e
            }

            return done(err)

          })
        }
      }),


      o({
        _type: testtube.Test,
        name: 'ForEach test',
        description: 'Testing forEach',
        doTest: function(ctx, done) {
          var cursor = ctx.global.testClient.getCollection('items', {paginated: true}).find()
          var count = 0
          var err = undefined
          cursor.forEach(function(item) {
            count ++
            try {
              assert(item.itemNumber == count)
            } catch (e) {
              err = e
            }


          }, function(e) {

            try {
              assert(e == null)
              assert(count == 300)

            } catch (e) {
              err = e
            }

            return done(err)
          })
        }
      }),

      o({
        _type: testtube.Test,
        name: 'ToArrayTest',
        description: 'testing toArray',
        doTest: function(ctx, done) {
          var cursor = ctx.global.testClient.getCollection('items', {paginated: true}).find()

          cursor.toArray(function(e, data) {
            var err = undefined
            try {
              assert(data != null)
              assert(e == null)
              assert(data.length == 300)

            } catch (e) {
              err = e
            }
            return done(err)

          })
        }
      }),

      o({
        _type: testtube.Test,
        name: 'SmallLimitTest',
        description: 'testing small custom limit',
        doTest: function(ctx, done) {
          var cursor = ctx.global.testClient.getCollection('items', {paginated: true}).find().limit(40)

          cursor.toArray(function(e, data) {
            var err = undefined
            try {
              assert(data != null)
              assert(e == null)
              assert(data.length == 40)

            } catch (e) {
              err = e
            }
            return done(err)

          })
        }
      }),

      o({
        _type: testtube.Test,
        name: 'MidLimitTest',
        description: 'testing mid custom limit',
        doTest: function(ctx, done) {
          var cursor = ctx.global.testClient.getCollection('items', {paginated: true}).find().limit(110)

          cursor.toArray(function(e, data) {
            var err = undefined
            try {
              assert(data != null)
              assert(e == null)
              assert(data.length == 110)

            } catch (e) {
              err = e
            }
            return done(err)

          })
        }
      }),


      o({
        _type: testtube.Test,
        name: 'LargeLimitTest',
        description: 'testing large custom limit',
        doTest: function(ctx, done) {
          var cursor = ctx.global.testClient.getCollection('items', {paginated: true}).find().limit(400)

          cursor.toArray(function(e, data) {
            var err = undefined
            try {
              assert(data != null)
              assert(e == null)
              assert(data.length == 300)

            } catch (e) {
              err = e
            }
            return done(err)

          })
        }
      }),

      o({
        _type: testtube.Test,
        name: 'SmallSkipTest',
        description: 'testing small custom skip',
        doTest: function(ctx, done) {
          var cursor = ctx.global.testClient.getCollection('items', {paginated: true}).find().skip(100)

          cursor.toArray(function(e, data) {
            var err = undefined
            try {
              assert(data != null)
              assert(e == null)
              assert.equal(data.length, 200)

            } catch (e) {
              err = e
            }
            return done(err)

          })
        }
      }),

      o({
        _type: testtube.Test,
        name: 'LargeSkipTest',
        description: 'testing large custom skip',
        doTest: function(ctx, done) {
          var cursor = ctx.global.testClient.getCollection('items', {paginated: true}).find().skip(400)

          cursor.toArray(function(e, data) {
            var err = undefined
            try {
              assert(data != null)
              assert(e == null)
              assert(data.length == 0)

            } catch (e) {
              err = e
            }
            return done(err)

          })
        }
      }),

      o({
        _type: testtube.Test,
        name: 'SmallBatchSizeTest',
        description: 'testing small custom limit',
        doTest: function(ctx, done) {
          var cursor = ctx.global.testClient.getCollection('items-large', {paginated: true}).find().limit(400)

          cursor.toArray(function(e, data) {
            var err = undefined
            try {
              assert(data != null)
              assert(e == null)
              assert.equal(data.length, 300)

            } catch (e) {
              err = e
            }
            return done(err)

          })
        }
      })

    ]
  })
})
