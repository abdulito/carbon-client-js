// require the client
var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var usersCollection = client.getCollection("users")
var itemsCollection = client.getCollection("items", {paginated: true})

