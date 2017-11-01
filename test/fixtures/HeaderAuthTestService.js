var __  = require('@carbon-io/fibers').__(module)
var _o  = require('@carbon-io/bond')._o(module)
var o   = require('@carbon-io/atom').o(module)
var carbond   = require('@carbon-io/carbond')

/***************************************************************************************************
 * ServiceForMongoDBCollectionTests
 */
module.exports = o({
  _type: _o("./TestService"),

  authenticator: o({
    _type: carbond.security.Authenticator,
    authenticate: function(req) {
      if (req.header("api_key") === "123") {
        return {
          "username": "test"
        }
      } else {
        return null
      }
    }
  })
})
