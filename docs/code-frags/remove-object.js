var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var usersCollection = client.getCollection("users")
usersCollection.removeObject( "123456",
  function(e, result) {
    console.log(result)
  }
)

/* underlying HTTP call
 * DELETE http://localhost:8888/users/123456
 */