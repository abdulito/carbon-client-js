var testClient = require('./setup')

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
  name: "CollectionTest",


  /*********************************************************************************************************************
   *
   */
  doTest: function () {
    console.log("Collections test ASYNC")

    var usersCollection = testClient.getCollection("users")

    // test find.toArray()

    console.log("testing users collection async find toArray")

    usersCollection.find().toArray(function(e, data) {
      assert(data != null)
      assert(e == null)
      console.log("users collection async find result: ")
      console.log(data)
      assert(data.length > 0)
      assert(data[0].username === "abdul")
      assert(data[1].username === "bob")
    })

    // test limit
    usersCollection.find({}, {limit: 1}).toArray(function(e, data) {
      assert(data != null)
      assert(e == null)
      console.log("users collection async find (limit:1) result: ")
      console.log(data)
      assert(data.length == 1)
      assert(data[0].username === "abdul")
    })

    // test skip
    usersCollection.find({}, {limit: 1, skip: 1}).toArray(function(e, data) {
      assert(data != null)
      assert(e == null)
      console.log("users collection async find (limit:1) result: ")
      console.log(data)
      assert(data.length == 1)
      assert(data[0].username === "bob")
    })

    // Cursor test
    var cursor = usersCollection.find()

    cursor.next(function(e, obj) {
      assert(obj != null)
      assert(e == null)
      console.log("testing cursor.next()")
      console.log(obj)

      assert(obj.username === "abdul")

      console.log("testing cursor.toArray() after next()!!!")
      cursor.toArray(function(e, data) {
          assert(data != null)
          assert(e == null)
          console.log("cursor.toArray() after next():")
          console.log(data)
          assert(data.length == 1)
          assert(data[0].username === "bob")
        }
      )
    })

    // test find.each()
    console.log("testing users collection async find toArray")

    usersCollection.find().each(function(e, item) {
      assert(e == null)
      if(item != null) {
        console.log("Users find.each() item")
        console.log(item)
        assert(item.username === "abdul" || item.username === "bob")
      } else {
        console.log("find.each() done!")
      }

    })


    // test insert users
    console.log("testing users collection async insert")

    usersCollection.insert({
        username: "joe"
      },
      function(e, result) {
        assert(e == null)
        assert(result != null)
        assert(result["_id"] != null)
        console.log("async insert result:")
        console.log(result)
      }
    )


    // test remove users
    console.log("testing users collection async remove")

    usersCollection.remove({
        username: "joe"
      },
      function(e, result) {
        assert(e == null)
        assert(result != null)
        assert(result.ok)
        console.log("async remove result:")
        console.log(result)
      }
    )

    // test removeObject

    usersCollection.removeObject("123",
      function(e, result) {
        assert(e == null)
        assert(result != null)
        assert(result.ok)
        console.log("async removeObject result:")
        console.log(result)
      }
    )

    // test updateObject

    usersCollection.update({
        username: "joe"
      }, {
        "$set": {
          email: "joe@foo.com"
        }
      },
      function(e, result) {
        assert(e == null)
        assert(result != null)
        assert(result.ok)
        console.log("async update result:")
        console.log(result)
      })

    // test saveObject

    usersCollection.saveObject("123", {
      username: "joe"
    },
      function(e, result) {
        assert(e == null)
        assert(result != null)
        assert(result.ok)
        console.log("async saveObject result:")
        console.log(result)
      }
    )

    // test updateObject

    usersCollection.updateObject("123", {
        "$set": {
          email: "joe@foo.com"
        }
      },
      function(e, result) {
        assert(e == null)
        assert(result != null)
        assert(result.ok)
        console.log("async updateObject result:")
        console.log(result)
      }
    )
  }
})
