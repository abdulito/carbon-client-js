var testClient = require('./setup')

var o   = require('@carbon-io/atom').o(module).main
var _o   = require('@carbon-io/bond')._o(module)
var testtube = require('@carbon-io/testtube')

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
  name: "ErrorTest",


  /*********************************************************************************************************************
   *
   */
  doTest: function () {

    testClient.getEndpoint("error").get(function (e, res) {
      assert(e != null)
      console.log("Caught expected error:")
      console.log(e)
      assert(e.message === "ERROR")
      assert(e.code === 500)
      console.log("Error test passed!")
    })
  }
})
