debugger
var assert = require('assert')
var nock = require('nock')
var _ = require('lodash')

var __ = require('@carbon-io/fibers').__(module)
var o   = require('@carbon-io/atom').o(module)
var _o   = require('@carbon-io/bond')._o(module)
var testtube = require('@carbon-io/test-tube')

var RestClient = require('../lib/RestClient')

__.main(function() {
  module.exports = o.main({
    /**********************************************************************
     * _type
     */
    _type: testtube.Test,

    /**********************************************************************
     * name
     */
    name: "SlowEndpointTests",

    /**********************************************************************
     * description
     */
    description: "test requests against an endpoint that takes 3 seconds to return",

    /**********************************************************************
     * setup
     */
    setup: function(ctx) {
      var testUrl = require('./setup').url

      // create the nock timeout endpoint. delay response for 5 seconds
      nock(testUrl).get('/timeout').delay(5000).reply(200, {
        "ok": 1
      }).persist()

      // create the client with a 3 second timeout
      ctx.global.client = new RestClient(testUrl, {
        timeout: 3000
      })

    },

    /**********************************************************************
     * teardown
     */
    teardown: function(ctx) {
      delete ctx.global.client
    },

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
          ctx.global.client.getEndpoint("timeout").get(function(e, res) {
            var err = undefined
            try {
              if (Date.now() - then >= 5000) {
                throw new testtube.errors.SkipTestError(
                  'nock is broken, see https://github.com/node-nock/nock/issues/754 ' +
                  'and https://github.com/node-nock/nock/pull/802')
              }
              assert(!_.isNull(e))
              assert.equal(e.message, "ETIMEDOUT")
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
          ctx.global.client.getEndpoint("timeout").get({timeout: 6000}, function(e, res) {
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
      }),
    ]
  })
})
