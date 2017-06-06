// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var usersCollection = client.getCollection("users")
// find all users and get _id and name, address.city only
usersCollection.find({}, {
  projection: {
    _id: 1,
    name: 1,
    "address.city": 1
  }
}).toArray(function(e, data) {
  for(var i=0; i < data.length; i++) {
    console.log(data[i])
  }

})

// exclude "address" only

// find all users and get _id and name, address.city only
usersCollection.find({}, {
  XXXprojection: {
    address: 0
  }
}).toArray(function(e, data) {
  for(var i=0; i < data.length; i++) {
    console.log(data[i])
  }

})