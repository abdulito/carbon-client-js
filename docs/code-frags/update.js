var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var usersCollection = client.getCollection("users")
usersCollection.update({
  parameters: {
    query: {
      _id: "123456"
    }
  }
},
  {
    "$set": {
      "name": "jack"
    }
  },
  function(e, result) {
    console.log(result)
  }
)

/* underlying HTTP call
 * PATCH http://localhost:8888/users?query={"_id":"123456"}
 * body: {"$set": {"name": "jack"}}
 */