var RestClient = require('../lib/RestClient')

var o   = require('@carbon-io/atom').o(module).main
var _o   = require('@carbon-io/bond')._o(module)
var testtube = require('@carbon-io/test-tube')

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
  name: "PathTest",


  /*********************************************************************************************************************
   *
   */
  doTest: function () {

    var uri = "http://localhost:8888"
    var c = new RestClient(uri)

    // path tests
    assert(c.getAbsolutePath() === '/')
    assert(c.getFullUrl() === uri)

    // single child
    var e = c.getEndpoint("foo")
    assert(e.parent === c)
    assert(e.getAbsolutePath() === '/foo')
    assert(e.getFullUrl() === "http://localhost:8888/foo")

    // deep
    var e2 = c.getEndpoint("foo/bar")
    assert(e2.parent === e)
    assert(e2.parent.parent === c)
    assert(e2.getAbsolutePath() === '/foo/bar')
    assert(e2.getFullUrl() === "http://localhost:8888/foo/bar")

    // deeper
    var e3 = e2.getEndpoint("bass")
    assert(e3.parent === e2)
    assert(e3.getAbsolutePath() === '/foo/bar/bass')
    assert(e3.getFullUrl() === "http://localhost:8888/foo/bar/bass")

    // edge cases
    var e4 = c.getEndpoint(null)
    assert(e4 === null)

    var e5 = c.getEndpoint(undefined)
    assert(e5 === null)

    var e6 = c.getEndpoint('')
    assert(e6 === null)
  }
})


