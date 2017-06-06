// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

// find user by id
var usersCollection = client.getCollection("users")
usersCollection.findObject("123456", (function(e, obj) {
  console.log("Object found:")
  console.log(obj)
}))

