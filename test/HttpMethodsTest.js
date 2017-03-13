var testClient = require('./setup')

var carbon_core = require('@carbon-io/carbon-core')

var o   = carbon_core.atom.o(module).main
var _o   = carbon_core.bond._o(module)
var testtube = carbon_core.testtube
var assert = require('assert')

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
  name: "HttpMethodsTest",


  /*********************************************************************************************************************
   *
   */
  doTest: function () {


    // GET
    testClient.getEndpoint("get-test").get(function(e, res) {
      assert(e == null)
      assert(res != null)
      assert(res.body === "GET")
      assert(res.statusCode == 200)
      console.log("get-test endpoint async GET result: " + res.body)
    })


    // POST
    testClient.getEndpoint("post-test").post(function(e, res) {
      assert(e == null)
      assert(res != null)
      assert(res.body === "POST")
      assert(res.statusCode == 200)
      console.log("post-test endpoint async POST result: " + res.body)
    })

    // PUT
    testClient.getEndpoint("put-test").put(function(e, res) {
      assert(e == null)
      assert(res != null)
      assert(res.body === "PUT")
      assert(res.statusCode == 200)
      console.log("put-test endpoint async PUT result: " + res.body)
    })

    // PATCH
    testClient.getEndpoint("patch-test").patch(function(e, res) {
      assert(e == null)
      assert(res != null)
      assert(res.body === "PATCH")
      console.log("patch-test endpoint async PATCH result: " + res.body)
    })

    // DELETE
    testClient.getEndpoint("delete-test").delete(function(e, res) {
      assert(e == null)
      assert(res != null)
      assert(res.body === "DELETE")
      assert(res.statusCode == 200)
      console.log("delete-test endpoint async DELETE result: " + res.body)
    })

    // HEAD
    testClient.getEndpoint("head-test").head(function(e, res) {
      assert(e == null)
      assert(res != null)
      assert(res.body === "HEAD")
      assert(res.statusCode == 200)
      console.log("head-test endpoint async HEAD result: " + res.body)
    })

    // OPTIONS
    testClient.getEndpoint("options-test").options(function(e, res) {
      assert(e == null)
      assert(res != null)
      assert(res.body === "OPTIONS")
      assert(res.statusCode == 200)
      console.log("options-test endpoint async OPTIONS result: " + res.body)
    })


    // 201 status
    testClient.getEndpoint("201-test").get(function(e, res) {
      assert(e == null)
      assert(res != null)
      assert(res.statusCode == 201)
      console.log("201-test endpoint async result: " + res.body)
    })


    // response headers test
    testClient.getEndpoint("response-headers-test").get(function(e, res) {
      assert(e == null)
      assert(res != null)
      assert(res.statusCode == 200)
      assert(res.headers["carbon-client"] === "cool")
      console.log("response headers test async result: " + res.headers)
    })

  }
})


