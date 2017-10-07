var __  = require('@carbon-io/fibers').__(module)
var _o  = require('@carbon-io/bond')._o(module)
var o   = require('@carbon-io/atom').o(module)
var carbond   = require('@carbon-io/carbond')
var testtube = require('@carbon-io/test-tube')
var RestClient = require('../lib/RestClient')
var _ = require('lodash')

/*********************************************************************************************************************
 * SEED DATA
 */
var SEED_DATA = {
  users: [
    {
      _id: '123',
      username: 'abdul',
      email: 'abdul@carbon-io.com'
    },
    {
      _id: '456',
      username: 'bob',
      email: 'bob@test.test'
    }
  ],
  items: []
}

for (var i = 1; i <= 300; i++) {
  SEED_DATA.items.push({itemNumber: i})
}

/***********************************************************************************************************************
 * Base class for CarbonClient tests
 */
module.exports = o.main({

  /*********************************************************************************************************************
   * _type
   */
  _type: testtube.Test,

  /*********************************************************************************************************************
   * name
   */
  name: "CarbonClient tests",

  /*********************************************************************************************************************
   * service
   */
  service: _o('./fixtures/TestService'),

  /*********************************************************************************************************************
   * clientClass
   */
  clientClass: RestClient,
  /*********************************************************************************************************************
   * setup
   */
  setup: function(ctx) {
    ctx.global.testServiceUrl = 'http://localhost:9088'
    ctx.global.testClient = new this.clientClass(ctx.global.testServiceUrl)
    this.service.start()
    this.clearDatabase()
    this.initializeDatabase()
  },

  /*********************************************************************************************************************
   * teardown
   */
  teardown: function(ctx) {
    this.clearDatabase()
    delete ctx.global.client
    this.service.stop()
  },


  /*********************************************************************************************************************
   * initializeDatabase
   */
  initializeDatabase: function() {
    var db = this.service.db

    _.mapKeys(SEED_DATA, function(docs, colName) {
      var c = db.getCollection(colName)

      for (var i = 0; i < docs.length; i++) {
        try {
          c.insert(docs[i])
        } catch (e) {
          console.log("IGNORED INSERT ERROR: " + e)
          // ignore
        }
      }
    })
  },

  /*********************************************************************************************************************
   * clearDatabase
   */
  clearDatabase: function() {
    var db = this.service.db

    _.mapKeys(SEED_DATA, function(docs, colName) {
      var c = db.getCollection(colName)

      try {
        c.drop()
      } catch (e) {
        // ignore
      }
    })
  }


})

