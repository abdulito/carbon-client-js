var assert = require('assert')
var nock = require('nock')
var _ = require('lodash')

var __ = require('@carbon-io/fibers').__(module)
var _o   = require('@carbon-io/bond')._o(module)
var o   = require('@carbon-io/atom').o(module)
var testtube = require('@carbon-io/test-tube')

var RestClient = require('../lib/RestClient')

__(function() {
  module.exports = o.main({
    /**********************************************************************
     * _type
     */
    _type: _o("./TestBase"),

    /**********************************************************************
     * name
     */
    name: "SlowEndpointTests",

    /**********************************************************************
     * description
     */
    description: "test requests against an endpoint that takes 3 seconds to return",


    /**********************************************************************
     *
     */
    tests: [
      o({
        _type: testtube.Test,
        name: 'TimeoutTest',
        description: 'testing /timeout with a 3 second timeout',
        doTest: function(ctx, done) {
          var then = Date.now()
          // create the client with a 3 second timeout
          ctx.global.testClient.defaultOptions.timeout = 3000

          ctx.global.testClient.getEndpoint("timeout").get(function(e, res) {
            var err = undefined
            try {
              if (Date.now() - then >= 5000) {
                throw new testtube.errors.SkipTestError(
                  'nock is broken, see https://github.com/node-nock/nock/issues/754 ' +
                  'and https://github.com/node-nock/nock/pull/802')
              }
              assert(!_.isNull(e))
              assert.equal(e.message, "ESOCKETTIMEDOUT")
            } catch (e) {
              err = e
            }
            done(err)
          })
        }
      }),
      o({
        _type: testtube.Test,
        name: 'NoTimeoutTest',
        description: 'testing /timeout with a 6 second timeout',
        doTest: function(ctx, done) {
          ctx.global.testClient.defaultOptions.timeout = undefined
          ctx.global.testClient.getEndpoint("timeout").get({timeout: 6000}, function(e, res) {
            var err = undefined
            try {
              assert(_.isNull(e))
              assert.equal(res.body.ok, 1)
            } catch (e) {
              err = e
            }
            done(err)
          })
        }
      })
    ]
  })
})
