// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

//  patch /users
client.getEndpoint("users").patch({
    "_id": "1234",
    "name": "bob"
  },
  function(e, response) {
    console.log("Response from /users:")
    console.log(response.body)
  })