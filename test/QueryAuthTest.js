var assert = require('assert')

var _ = require('lodash')

var __ = require('@carbon-io/fibers').__(module)
var _o = require('@carbon-io/bond')._o(module)
var o = require('@carbon-io/atom').o(module)
var testtube = require('@carbon-io/test-tube')

var RestClient = require('../lib/RestClient')

var NODE_MAJOR_VERSION = parseInt(process.version.match(/v(\d+)\..+/)[1])

/******************************************************************************
 *
 */
__(function() {
  module.exports = o.main({
    /**********************************************************************
     * _type
     */
    _type: _o("./TestBase"),

    /**********************************************************************
     * name
     */
    name: 'AuthTests',

    service: _o("./fixtures/QueryAuthTestService"),

    /**********************************************************************
     *
     */
    tests: [
      o({
        _type: testtube.Test,
        name: 'AuthQueryTests',
        description: '',
        tests: [
          o({
            _type: testtube.Test,
            name: 'AuthQueryUserCollectionFindTest',
            description: 'testing query-authenticated users collection find',
            setup: function(ctx) {
              ctx.local.client = new RestClient(ctx.global.testServiceUrl, {
                authentication: {
                  type: 'api-key',
                  apiKey:'123',
                  apiKeyParameterName: 'api_key',
                  apiKeyLocation: 'query'
                }
              })
            },
            doTest: function(ctx, done) {
              ctx.local.client.getCollection('users')
                              .find()
                              .toArray(function(e, data) {
                                var err = undefined
                                try {
                                  assert(_.isNull(e))
                                  assert(!_.isNull(data))
                                  assert(data.length > 1)
                                  assert.equal(data[0].username, 'abdul')
                                } catch (e) {
                                  err = e
                                }
                                done(err)
                              })
            }
          }),
          o({
            _type: testtube.Test,
            name: 'AuthQueryBadApiKeyUserCollectionFindTest',
            description: 'testing query-authenticated users collection ' +
                         'with bad api key',
            setup: function(ctx) {
              ctx.local.badClient = new RestClient(ctx.global.testServiceUrl, {
                authentication: {
                  type: 'api-key',
                  apiKey:'BAD API KEY',
                  apiKeyParameterName: 'api_key',
                  apiKeyLocation: 'header'
                }
              })
            },
            doTest: function(ctx, done) {
              ctx.local.badClient.getCollection('users')
                                 .find()
                                 .toArray(function(e, data) {
                                   var err = undefined
                                   try {
                                     assert(!_.isNull(e))
                                     assert.equal(e.code, 403)
                                   } catch (e) {
                                     err = e
                                   }
                                   done(err)
                                 })
            }
          })
        ]
      })
    ]
  })
})
