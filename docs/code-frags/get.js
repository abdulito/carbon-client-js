// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

// call get() which will call GET on http://localhost:8888/hello
client.getEndpoint("hello").get(function(e, res) {
  console.log("Response from /hello: ")
  console.log(res.body)
})