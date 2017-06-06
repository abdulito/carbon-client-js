// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

// find all users
var usersCollection = client.getCollection("users")
usersCollection.insert({
  _id: "123456",
  name: "joe",
  address: {
    city: "San Francisco",
    zipcode: 94401
  }
},
  function(e, result) {
    console.log(result)
  }
)
