var RestClient = require('../lib/RestClient')
var assert = require('assert');

/*******************************************************************************
 * Request tests
 * 
 * XXX these tests require a particlar server to run. Should use something
 * like mockbin instead, or another form of mocking the server. 
 */
var uri = "http://localhost:8888"
var client = new RestClient(uri)

// Basic endpoint
var e = client.getEndpoint("zipcodes")
var options = {
  headers: {
    API_KEY: "345"
  }
}

// These will run in parallel
/*
e.get(options, function(err, res) {
  console.log("Endpoint test results")
  if (err) {
    console.log(err)
  } else {
    console.log(res.statusCode)
    console.log(res.body)
    console.log(typeof(res.body))
  }
})
*/

// Collection
var c = client.getCollection("zipcodes")
c.find(function(err, data) {
  console.log("Collection test results")
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
})



