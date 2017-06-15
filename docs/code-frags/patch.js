// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

//  patch /users
client.getEndpoint("users/1234").patch({
    "name": "bob"
  },
  function(e, res) {
    console.log("Response from /users:")
    console.log(res.body)
  })