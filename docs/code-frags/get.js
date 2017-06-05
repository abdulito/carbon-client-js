// require the client
var CarbonClient = require('@carbon-io/carbon-client')

// Service for this example: https://github.com/carbon-io/example__hello-world-service/blob/master/lib/HelloService.js

var client = new CarbonClient("http://localhost:8888")

// call get() which will call GET on http://localhost:8888/hello
client.getEndpoint("hello").get(function(e, response) {
  console.log("Response from /hello: ")
  console.log(response.body)
})