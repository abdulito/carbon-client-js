// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var usersCollection = client.getCollection("users")
var cursor = usersCollection.find()
cursor.each(function(e, item) {
  if (item == null) {
    console.log("Finish!")
  } else {
    console.log(item)
  }

})