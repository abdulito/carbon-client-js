var __ = require('@carbon-io/fibers').__(module)
var _o   = require('@carbon-io/bond')._o(module)
var o   = require('@carbon-io/atom').o(module)
var testtube = require('@carbon-io/test-tube')

/******************************************************************************
 * All tests
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: testtube.Test,

    /**********************************************************************
     * name
     */
    name: "Carbon Client JS tests",

    /**********************************************************************
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
})
