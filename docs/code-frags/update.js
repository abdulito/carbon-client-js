var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var usersCollection = client.getCollection("users")
usersCollection.update({
  "_id": "123456"
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
