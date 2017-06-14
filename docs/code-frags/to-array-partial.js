// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var usersCollection = client.getCollection("users")
var cursor = usersCollection.find()
cursor.next(function(e, obj) {
  console.log("First item in cursor:")
  console.log(obj)
  cursor.toArray(function(e, data) {
    console.log("Remaining items in cursor:")
    console.log(data)
  })
})


