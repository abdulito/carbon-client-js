// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var options = {
  params: {
    who: "carbon"

  }
}

// GET http://localhost:8888/hello?message="Welcome to carbon-io!"
client.getEndpoint("hello").get(options, function(e, response) {
  console.log("Response from /hello: ")
  console.log(response.body)
})