var CarbonClient = require('@carbon-io/carbon-client')

var client = new CarbonClient("http://localhost:8888")

var usersCollection = client.getCollection("users")

// CAUTION! save operation will replace the whole user collection with the following list
usersCollection.save([
  {
    _id: "123456",
    name: "joe",
    address: {
      city: "San Francisco",
      zipcode: 94401
    }
  }],
  function(e, result) {
    console.log(result)
  }
)


/* underlying HTTP call
 * PUT http://localhost:8888/users/123456
 * body: {_id: "123456",name: "joe",address: {city: "San Francisco",zipcode: 94401}}
 */