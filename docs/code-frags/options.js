// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

//  call http OPTIONS method
client.getEndpoint("test-options").options(null,
  function(e, res) {
    console.log("Response from /test-options:")
    console.log(res.body)
  })