var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var usersCollection = client.getCollection("users")
usersCollection.insert([{
  name: "joe",
  address: {
    city: "San Francisco",
    zipcode: 94401
  }
}],
  function(e, result) {
    console.log(result)
  }
)
