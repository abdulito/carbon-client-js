// require the client
var CarbonClient = require('@carbon-io/carbon-client')

// Service for this example: https://github.com/carbon-io/example__hello-world-service/blob/master/lib/HelloService.js

var client = new CarbonClient("http://localhost:8888")

// find all users
var usersCollection = client.getCollection("users")
// find all users sort by name descending
usersCollection.find({}, {sort:{"name": -1}}).toArray(function(e, data) {
  for(var i=0; i < data.length; i++) {
    console.log(data[i])
  }

})