debugger
var assert = require('assert')

var _ = require('lodash')

var __ = require('@carbon-io/fibers').__(module)
var o = require('@carbon-io/atom').o(module)
var _o = require('@carbon-io/bond')._o(module)
var testtube = require('@carbon-io/test-tube')

var RestClient = require('../lib/RestClient')

/******************************************************************************
 *
 */
__.main(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: testtube.Test,

    /**********************************************************************
     * name
     */
    name: "PathTest",

    /**********************************************************************
     * setup
     */
    setup: function(ctx) {
      ctx.global.uri = "http://localhost:8888"
      ctx.global.c = new RestClient(ctx.global.uri)
      ctx.global.endpoints = {}
    },
    
    /**********************************************************************
     * teardown
     */
    teardown: function(ctx) {
      delete ctx.global.uri
      delete ctx.global.c
      delete ctx.global.endpoints
    },

    /**********************************************************************
     *
     */
    tests: [
      o({
        _type: testtube.Test,
        name: 'RootTest',
        description: 'Root test',
        doTest: function(ctx) {
          assert.equal(ctx.global.c.getAbsolutePath(), '/')
          assert.equal(ctx.global.c.getFullUrl(),
                       ctx.global.uri)
        }
      }),
      o({
        _type: testtube.Test,
        name: 'SingleChildTest',
        description: 'Single child test',
        doTest: function(ctx) {
          var e = ctx.global.endpoints.e 
                = ctx.global.c.getEndpoint("foo")
          assert.equal(e.parent, ctx.global.c)
          assert.equal(e.getAbsolutePath(), '/foo')
          assert.equal(e.getFullUrl(), "http://localhost:8888/foo")
        }
      }),
      o({
        _type: testtube.Test,
        name: 'SingleGrandchildTest',
        description: 'Single grandchild test',
        doTest: function(ctx) {
          var e2 = ctx.global.endpoints.e2 
                 = ctx.global.c.getEndpoint("foo/bar")
          assert.equal(e2.parent, ctx.global.endpoints.e)
          assert.equal(e2.parent.parent, ctx.global.c)
          assert.equal(e2.getAbsolutePath(), '/foo/bar')
          assert.equal(e2.getFullUrl(), "http://localhost:8888/foo/bar")
        }
      }),
      o({
        _type: testtube.Test,
        name: 'SingleGreatGrandchildTest',
        description: 'Single great grandchild test',
        doTest: function(ctx) {
          var e3 = ctx.global.endpoints.e3 
                 = ctx.global.endpoints.e2.getEndpoint("bass")
          assert.equal(e3.parent, ctx.global.endpoints.e2)
          assert.equal(e3.getAbsolutePath(), '/foo/bar/bass')
          assert.equal(e3.getFullUrl(), "http://localhost:8888/foo/bar/bass")
        }
      }),
      o({
        _type: testtube.Test,
        name: 'EdgeCaseTest',
        description: 'Edge case test',
        doTest: function(ctx) {
          var e = ctx.global.c.getEndpoint(null)
          assert(_.isNull(e))
          e = ctx.global.c.getEndpoint(undefined)
          assert(_.isNull(e))
          e = ctx.global.c.getEndpoint('')
          assert(_.isNull(e))
        }
      }),
    ]
  })
})
