var assert = require('assert')

var _ = require('lodash')

var __ = require('@carbon-io/fibers').__(module)
var _o = require('@carbon-io/bond')._o(module)
var o = require('@carbon-io/atom').o(module)
var testtube = require('@carbon-io/test-tube')


/******************************************************************************
 *
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: testtube.Test,

    /**********************************************************************
     * name
     */
    name: "HttpMethodsTest",

    /**********************************************************************
     * setup
     */
    setup: function(ctx) {
      ctx.global.testClient = require('./setup')
    },

    /**********************************************************************
     * teardown
     */
    teardown: function(ctx) {
      delete ctx.global.testClient
    },

    /**********************************************************************
     * tests
     */
    tests: [
      o({
        _type: testtube.Test,
        name: 'GetTest',
        description: 'Get test',
        doTest: function(ctx, done) {
          ctx.global.testClient.getEndpoint("get-test").get(function(e, res) {
            var err 
            try {
              assert(_.isNull(e))
              assert(!_.isNull(res))
              assert.equal(res.body, "GET")
              assert.equal(res.statusCode, 200)
            } catch (e) {
              err = e
            }
            done(err)
          })
        }
      }),
      o({
        _type: testtube.Test,
        name: 'PostTest',
        description: 'Post test',
        doTest: function(ctx, done) {
          ctx.global.testClient.getEndpoint("post-test").post(function(e, res) {
            var err = undefined
            try {
              assert(_.isNull(e))
              assert(!_.isNull(res))
              assert.equal(res.body, "POST")
              assert.equal(res.statusCode, 200)
            } catch (e) {
              err = e
            }
            done(err)
          })
        }
      }),
      o({
        _type: testtube.Test,
        name: 'PutTest',
        description: 'Put test',
        doTest: function(ctx, done) {
          ctx.global.testClient.getEndpoint("put-test").put(function(e, res) {
            var err = undefined
            try {
              assert(_.isNull(e))
              assert(!_.isNull(res))
              assert.equal(res.body, "PUT")
              assert.equal(res.statusCode, 200)
            } catch (e) {
              err = e
            }
            done(err)
          })
        }
      }),
      o({
        _type: testtube.Test,
        name: 'PatchTest',
        description: 'Patch test',
        doTest: function(ctx, done) {
          ctx.global.testClient.getEndpoint("patch-test").patch(function(e, res) {
            var err = undefined
            try {
              assert(_.isNull(e))
              assert(!_.isNull(res))
              assert.equal(res.body, "PATCH")
            } catch (e) {
              err = e
            }
            done(err)
          })
        }
      }),
      o({
        _type: testtube.Test,
        name: 'DeleteTest',
        description: 'Delete test',
        doTest: function(ctx, done) {
          ctx.global.testClient.getEndpoint("delete-test").delete(function(e, res) {
            var err = undefined
            try {
              assert(_.isNull(e))
              assert(!_.isNull(res))
              assert.equal(res.body, "DELETE")
              assert(res.statusCode, 200)
            } catch (e) {
              err = e
            }
            done(err)
          })
        }
      }),
      o({
        _type: testtube.Test,
        name: 'HeadTest',
        description: 'Head test',
        doTest: function(ctx, done) {
          ctx.global.testClient.getEndpoint("head-test").head(function(e, res) {
            var err = undefined
            try {
              assert(_.isNull(e))
              assert(!_.isNull(res))
              assert.equal(res.body, "HEAD")
              assert.equal(res.statusCode, 200)
            } catch (e) {
              err = e
            }
            done(err)
          })
        }
      }),
      o({
        _type: testtube.Test,
        name: 'OptionsTest',
        description: 'Options test',
        doTest: function(ctx, done) {
          ctx.global.testClient.getEndpoint("options-test").options(function(e, res) {
            var err = undefined
            try {
              assert(_.isNull(e))
              assert(!_.isNull(res))
              assert.equal(res.body, "OPTIONS")
              assert.equal(res.statusCode, 200)
            } catch (e) {
              err = e
            }
            done(err)
          })
        }
      }),
      o({
        _type: testtube.Test,
        name: '201Test',
        description: '201 test',
        doTest: function(ctx, done) {
          ctx.global.testClient.getEndpoint("201-test").get(function(e, res) {
            var err = undefined
            try {
              assert(_.isNull(e))
              assert(!_.isNull(res))
              assert.equal(res.statusCode, 201)
            } catch (e) {
              err = e
            }
            done(err)
          })
        }
      }),
      o({
        _type: testtube.Test,
        name: 'ResponseHeadersTest',
        description: 'Response headers test',
        doTest: function(ctx, done) {
          ctx.global.testClient.getEndpoint("response-headers-test").get(function(e, res) {
            var err = undefined
            try {
              assert(_.isNull(e))
              assert(!_.isNull(res))
              assert.equal(res.statusCode, 200)
              assert.equal(res.headers["carbon-client"], "cool")
            } catch (e) {
              err = e
            }
            done(err)
          })
        }
      }),
    ]
  })
})
