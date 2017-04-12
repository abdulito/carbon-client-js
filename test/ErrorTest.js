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
    name: 'ErrorTest',

    /**********************************************************************
     * setup
     */
    setup: function(ctx) {
      ctx.local.testClient = require('./setup')
    },


    /**********************************************************************
     *
     */
    doTest: function (ctx, done) {
      ctx.local.testClient.getEndpoint('error').get(function (e, res) {
        var err = undefined
        try {
          assert(!_.isNull(e))
          assert.equal(e.message, 'ERROR')
          assert.equal(e.code, 500)
        } catch (e) {
          err = e
        }
        done(err)
      })
    }
  })
})
