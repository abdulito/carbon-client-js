// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

//  call http DELETE method
client.getEndpoint("test-delete").delete(null,
  function(e, res) {
    console.log("Response from /test-delete:")
    console.log(res.body)
  })