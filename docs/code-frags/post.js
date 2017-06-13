// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var body = {
  msg: "Welcome to carbon-io!"
}

client.getEndpoint("hello").post(body, function(e, res) {
  console.log("Response from /hello: ")
  console.log(res.body)
})