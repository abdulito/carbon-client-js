// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

//  call http HEAD method
client.getEndpoint("test-head").head(function(e, res) {
    console.log("Response from /test-head:")
    console.log(res.body)
  })