// require the client
var CarbonClient = require('@carbon-io/carbon-client')

// Service for this example: https://github.com/carbon-io/example__hello-world-service-parameter-parsing/blob/master/lib/HelloService.js

var client = new CarbonClient("http://localhost:8888")

// create an endpoint object for /hello
var endpoint = client.getEndpoint("hello")

var options = {
  params: {
    who: "carbon"

  }
}

// GET http://localhost:8888/hello?message="Welcome to carbon-io!"
endpoint.get(options, function(e, response) {
  console.log("Response from /hello: ")
  console.log(response.body)
})