// require the client
var CarbonClient = require('@carbon-io/carbon-client')

// Service for this example: https://github.com/carbon-io/example__hello-world-service/blob/master/lib/HelloService.js

var client = new CarbonClient("http://localhost:8888")

// find all users
var usersCollection = client.getCollection("users")
var cursor = usersCollection.find()
cursor.each(function(e, item) {
  if (item == null) {
    console.log("Finish!")
  } else {
    console.log(item)
  }


})