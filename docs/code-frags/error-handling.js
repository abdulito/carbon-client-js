var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

// GET http://localhost:8888/doesnotexit
client.getEndpoint("doesnotexit").get(function(e, res) {
  if(e) {
    console.log("Caught an error")
    console.log("code: " + e.code); // 404
    console.log("message: " + e.message);
    console.log("description: " + e.description);
  }
})