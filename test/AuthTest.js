var testUrl = require('./setup').url
var RestClient = require('../lib/RestClient')

var o   = require('@carbon-io/atom').o(module).main
var _o   = require('@carbon-io/bond')._o(module)
var testtube = require('@carbon-io/testtube')

var assert = require('assert')
var nock = require('nock')


/***********************************************************************************************************************
 *
 */
module.exports = o({

  /*********************************************************************************************************************
   * _type
   */
  _type: testtube.Test,

  /*********************************************************************************************************************
   * name
   */
  name: "AuthTest",


  /*********************************************************************************************************************
   *
   */
  doTest: function () {

    // create the nock header authed endpoint
    nock(testUrl).get('/header-authenticated-users').matchHeader('API_KEY', '123')
      .reply(200, [{
        _id: '123',
        username: 'abdul',
        email: 'abdul@carbon-io.com'
      }]).persist();


    // create the client
    var client = new RestClient(testUrl, {
      authentication: {
        type: "api-key",
        apiKey:"123",
        apiKeyParameterName: "API_KEY",
        apiKeyLocation: "header"
      }
    });

    console.log("testing header-authenticated users collection find")

    client.getCollection("header-authenticated-users").find().toArray(function(e, data) {
      assert(e == null)
      assert(data != null)
      console.log("users collection async find result: ")
      console.log(data)
      assert(data.length === 1)
      assert(data[0].username === "abdul")
    })


    var badClient = new RestClient(testUrl, {
      authentication: {
        type: "api-key",
        apiKey:"BAD API KEY",
        apiKeyParameterName: "API_KEY",
        apiKeyLocation: "header"
      }
    });

    console.log("testing header-authenticated users collection with bad api key")

    badClient.getCollection("header-authenticated-users").find().toArray(function(e, data) {
      assert(e != null)
      console.log("Caught expected error:")
      console.log(e)
      assert(e.code === 500)
      console.log("Error test passed!")
    })


    /**********************************************************************
     * query based authentication tests
     */
    // create the nock header authed endpoint
    nock(testUrl).get('/query-authenticated-users?API_KEY=123')
      .reply(200, [{
        _id: '123',
        username: 'abdul',
        email: 'abdul@carbon-io.com'
      }]).persist();


    // create the client
    var client2 = new RestClient(testUrl, {
      authentication: {
        type: "api-key",
        apiKey:"123",
        apiKeyParameterName: "API_KEY",
        apiKeyLocation: "query"
      }
    });

    console.log("testing header-authenticated users collection find")

    client2.getCollection("query-authenticated-users").find().toArray(function(e, data) {
      console.log(e)
      assert(e == null)
      assert(data != null)
      console.log("users collection async find result: ")
      console.log(data)
      assert(data.length === 1)
      assert(data[0].username === "abdul")
    })


    var badClient2 = new RestClient(testUrl, {
      authentication: {
        type: "api-key",
        apiKey:"BAD API KEY",
        apiKeyParameterName: "API_KEY",
        apiKeyLocation: "header"
      }
    });

    console.log("testing query-authenticated users collection with bad api key")

    badClient2.getCollection("query-authenticated-users").find().toArray(function(e, data) {
      assert(e != null)
      console.log("Caught expected error:")
      console.log(e)
      assert(e.code === 500)
      console.log("Error test passed!")
    })
  }
})
