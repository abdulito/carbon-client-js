// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var usersCollection = client.getCollection("users", {paginated: true})
usersCollection.find().skip(1).limit(1).toArray(function(e, data) {
  for( var i=0; i < data.length; i++) {
    console.log(data[i])
  }

})

// this can also be achieved using options argument

usersCollection.find({skip: 1, limit:1}).toArray(function(e, data) {
  for( var i=0; i < data.length; i++) {
    console.log(data[i])
  }

})
