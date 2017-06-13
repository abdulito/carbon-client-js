// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

//  put to /users/1234
client.getEndpoint("users/1234").put({
    "_id": "1234",
    "name": "bob"
  },
  function(e, res) {
    console.log("Response from /users:")
    console.log(res.body)
  })