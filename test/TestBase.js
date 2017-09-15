var __  = require('@carbon-io/fibers').__(module)
var _o  = require('@carbon-io/bond')._o(module)
var o   = require('@carbon-io/atom').o(module)
var carbond   = require('@carbon-io/carbond')
var testtube = require('@carbon-io/test-tube')
var RestClient = require('../lib/RestClient')
var _ = require('lodash')


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
  ]
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
  name: "CarbonClient node tests",

  service: _o('./fixtures/TestService'),

  /*********************************************************************************************************************
   * setup
   */
  setup: function(ctx) {
    ctx.global.testClient = new RestClient('http://localhost:9088')
    this.service.start()
    this.initializeDatabase(this.service.db)
  },

  /*********************************************************************************************************************
   * teardown
   */
  teardown: function(ctx) {
    this.clearDatabase()
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
          // ignore
        }
      }
    })
  },

  /*****************************************************************************
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

