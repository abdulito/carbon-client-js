var carbon_core = require('@carbon-io/carbon-core')

var o   = carbon_core.atom.o(module).main
var _o   = carbon_core.bond._o(module)
var testtube = carbon_core.testtube

/***********************************************************************************************************************
 * All tests
 */
module.exports = o({

  /*********************************************************************************************************************
   * _type
   */
  _type: testtube.Test,

  /*********************************************************************************************************************
   * name
   */
  name: "Carbon Client JS tests",

  /*********************************************************************************************************************
   * tests
   */
  tests: [
    _o('./PathTest'),
    _o('./HttpMethodsTest'),
    _o('./TimeoutTest'),
    _o('./AuthTest'),
    _o('./CollectionsTest'),
    _o('./ErrorTest')
  ]
})
