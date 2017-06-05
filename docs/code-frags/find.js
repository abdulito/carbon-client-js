// require the client
var CarbonClient = require('@carbon-io/carbon-client')

// Service for this example: https://github.com/carbon-io/example__hello-world-service/blob/master/lib/HelloService.js

var client = new CarbonClient("http://localhost:8888")

// find all users
var usersCollection = client.getCollection("users")
usersCollection.find().toArray(function(e, data) {
  console.log("All users")
  console.log(data)
})

// find by query
usersCollection.find({"name": "joe"}).toArray(function(e, data) {
  console.log("All users matching name 'joe'")
  console.log(data)
})
