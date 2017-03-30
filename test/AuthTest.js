var assert = require('assert')

var _ = require('lodash')
var nock = require('nock')

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
    name: 'AuthTests',

    /**********************************************************************
     * setup
     */
    setup: function(ctx) {
      ctx.global.testUrl = require('./setup').url
    },
    
    /**********************************************************************
     * teardown
     */
    teardown: function(ctx) {
      delete ctx.global.testUrl
    },

    /**********************************************************************
     *
     */
    tests: [
      o({
        _type: testtube.Test,
        name: 'AuthHeaderTests',
        description: '',
        setup: function(ctx) {
          nock(ctx.global.testUrl).get('/header-authenticated-users')
            .matchHeader('API_KEY', '123')
            .reply(200, [{
              _id: '123',
              username: 'abdul',
              email: 'abdul@carbon-io.com'
            }]).persist()
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'AuthHeaderUserCollectionFindTest',
            description: 'testing header-authenticated users collection find',
            setup: function(ctx) {
              ctx.local.client = new RestClient(ctx.global.testUrl, {
                authentication: {
                  type: 'api-key',
                  apiKey:'123',
                  apiKeyParameterName: 'API_KEY',
                  apiKeyLocation: 'header'
                }
              })
            },
            doTest: function(ctx, done) {
              ctx.local.client.getCollection('header-authenticated-users')
                    .find()
                    .toArray(function(e, data) {
                      var err = undefined
                      try {
                        assert(_.isNull(e))
                        assert(!_.isNull(data))
                        assert.equal(data.length, 1)
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
            name: 'AuthHeaderBadApiKeyUserCollectionFindTest',
            description: 'testing header-authenticated users collection ' +
                         'with bad api key',
            setup: function(ctx) {
              ctx.local.badClient = new RestClient(ctx.global.testUrl, {
                authentication: {
                  type: 'api-key',
                  apiKey:'BAD API KEY',
                  apiKeyParameterName: 'API_KEY',
                  apiKeyLocation: 'header'
                }
              })
            },
            doTest: function(ctx, done) {
              ctx.local.badClient.getCollection('header-authenticated-users')
                                 .find()
                                 .toArray(function(e, data) {
                                   var err = undefined
                                   try {
                                     assert(!_.isNull(e))
                                     assert.equal(e.code, 500)
                                   } catch (e) {
                                     err = e
                                   }
                                   done(err)
                                 })
            }
          }),
        ]
      }),
      o({
        _type: testtube.Test,
        name: 'AuthQueryTests',
        description: '',
        setup: function(ctx) {
          nock(ctx.global.testUrl).get('/query-authenticated-users?API_KEY=123')
            .reply(200, [{
              _id: '123',
              username: 'abdul',
              email: 'abdul@carbon-io.com'
            }]).persist()
        },
        tests: [
          o({
            _type: testtube.Test,
            name: 'AuthQueryUserCollectionFindTest',
            description: 'testing query-authenticated users collection find',
            setup: function(ctx) {
              ctx.local.client = new RestClient(ctx.global.testUrl, {
                authentication: {
                  type: 'api-key',
                  apiKey:'123',
                  apiKeyParameterName: 'API_KEY',
                  apiKeyLocation: 'query'
                }
              })
            },
            doTest: function(ctx, done) {
              ctx.local.client.getCollection('query-authenticated-users')
                              .find()
                              .toArray(function(e, data) {
                                var err = undefined
                                try {
                                  assert(_.isNull(e))
                                  assert(!_.isNull(data))
                                  assert.equal(data.length, 1)
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
              ctx.local.badClient = new RestClient(ctx.global.testUrl, {
                authentication: {
                  type: 'api-key',
                  apiKey:'BAD API KEY',
                  apiKeyParameterName: 'API_KEY',
                  apiKeyLocation: 'header'
                }
              })
            },
            doTest: function(ctx, done) {
              ctx.local.badClient.getCollection('query-authenticated-users')
                                 .find()
                                 .toArray(function(e, data) {
                                   var err = undefined
                                   try {
                                     assert(!_.isNull(e))
                                     assert.equal(e.code, 500)
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
