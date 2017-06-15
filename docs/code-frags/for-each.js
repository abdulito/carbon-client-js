// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var usersCollection = client.getCollection("users")
var cursor = usersCollection.find()
cursor.forEach(function(item) {
  console.log(item)
}, function (e) {
  console.log("Finish!")
  if (e) {
    console.log("Caught error in forEach():")
    console.log(e)
  }}
)