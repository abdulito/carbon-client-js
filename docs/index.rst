.. _carbon-client:

================
Carbon Client JS
================

CarbonClient is the client-component for Carbon.io. It is a light-weight
RESTFul client For NodeJS that can connect to any REST API. It uses the
standard node ``request`` module to make http calls.

Main features:

-  Support for all HTTP methods: ``GET``, ``PUT``, ``POST``, ``CREATE``,
   ``DELETE``, ``HEAD``, ``OPTIONS``, ``PATCH``.
-  Support for all Carbon.io collections endpoint methods: ``find()``,
   ``insert()``, ``update()``, ``findObject()``, ``updateObject()``,
   ``saveObject()``, ``remove()``, ``removeObject()``.

-  Authentication

------------
Installation
------------


Include carbon-client.js in your scripts and you are good to go!



.. code:: html

  <script src="build/carbon-client.js" type="application/javascript"></script>


-----------
Quick Start
-----------

This is a simple example for an http get operation

.. literalinclude:: code-frags/quick-start.js
    :language: javascript
    :linenos:

---
Use
---

****************
Basic HTTP calls
****************

All http methods are supported through ``Endpoint`` object. Each http
method has a matching ``Endpoint`` method with same name all lowercase.
e.g. ``GET`` is done by ``Endpoint.get()``, ``POST`` with
``Endpoint.post()``, etc...

***
GET
***

Supported calling forms for ``Endpoint.get()`` are as follows:

-  get(cb)
-  get(options, cb)

.. literalinclude:: code-frags/get.js
    :language: javascript
    :linenos:

***************
Response object
***************

The ``response`` object that is returned by ``CarbonClient`` is the
response object from the nodejs ``request`` module. Full doc here
https://github.com/request/request

Some available fields are:

.. code:: javascript


    response.statusCode: http status code (int)
    response.headers: an object containing response headers
    response.body: response body

***************************
Passing query string params
***************************

Query string params are passed as an object through the
``options.params`` argument of each http method


.. literalinclude:: code-frags/get-with-params.js
    :language: javascript
    :linenos:

****
POST
****

Supported calling forms for ``Endpoint.post()`` are as follows:

-  post(cb)
-  post(body, cb)
-  post(body, options, cb)


.. literalinclude:: code-frags/post.js
    :language: javascript
    :linenos:

*********
PUT/PATCH
*********

``PUT``, ``PATCH`` can be performed with ``Endpoint.put()``,
``Endpoint.patch()`` methods respectively. Arguments of these methods
are all the same and similar to the ``Endpoint.post()`` method.

.. literalinclude:: code-frags/put.js
    :language: javascript
    :linenos:

*******************
HEAD/OPTIONS/DELETE
*******************

``HEAD``, ``OPTIONS``, ``DELETE`` can be performed with
``Endpoint.head()``, ``Endpoint.options()``, ``Endpoint.delete()``
methods respectively. Arguments of these methods are all the same and
similar to the ``Endpoint.get()`` method.

Supported calling forms for ``Endpoint.head()`` are as follows:

-  head(cb)
-  head(options, cb)

.. code:: javascript

    //  call http HEAD method
    client.getEndpoint("test-head").head(null,
      function(e, response) {
        console.log("Response from /test-head:")
        console.log(response.body)
    })

***********************
Collections and Cursors
***********************

CarbonClient provides convenient interfaces to access collections. It
provides classes similar to MongoDB Driver Collection/Cursor classes.
You can perform ``find()``, ``insert()``, ``update()``,
``findObject()``, ``updateObject()``, ``saveObject()``, ``remove()``,
``removeObject()``.

^^^^^^
find()
^^^^^^

The ``find()`` method returns a ``Cursor`` object which is used to
iterate over results.

``find()`` supports the following calling forms

-  ``find(query)``
-  ``find(query, options)``

.. code:: javascript

    // find all users
    var usersCollection = client.getCollection("users")
    usersCollection.find().toArray(function(e, data) {
      console.log("All users")
      console.log(data)
    })

    // find by query
    usersCollection.find({"name": "joe"}).toArray(function(e, data) {
      console.log("All users matching name 'joe'")
      console.log(data)
    })

    })

The ``find()`` method returns a ``Cursor`` object which is used to
iterate over results.

Cursor iteration
''''''''''''''''

The ``Cursor.toArray()`` loads all results into a single array object
which could be memory consuming. To avoid that, use the
``Cursor.each()`` method which takes a function to iterate over each
item of results. It will return ``null`` when the cursor finishes.

.. code:: javascript

    // find all users
    var usersCollection = client.getCollection("users")
    var cursor = usersCollection.find()
    cursor.each(function(e, item) {
      if (item == null) {
        console.log("Finish!")
      } else {
         console.log(item)
      }


    })

Cursors also provide a ``next()`` method to iterate over a single item.
It will return ``null`` when the cursor finishes.

.. code:: javascript

    // find all users
    var usersCollection = client.getCollection("users")
    var cursor = usersCollection.find()
    cursor.next(function(e, item) {
      if (item == null) {
        console.log("Finish!")
      } else {
        console.log("Next item:")
        console.log(item)
      }

    })

Cursor pagination
'''''''''''''''''

Pagination for results returned by ``find()`` can be achieved with
``skip`` and ``limit`` options through the ``options`` argument:

.. code:: javascript


    var usersCollection = client.getCollection("users")
    var cursor = usersCollection.find({}, {skip:100, limit:100}).toArray(function(e, data) {
      for(var i=0; i < data.length; i++) {
         console.log(data[i])
      }

    })

Sorting find() results
''''''''''''''''''''''

``options`` argument also allows ``sort`` which takes a key to sort on:

.. code:: javascript


    var usersCollection = client.getCollection("users")

    // find all users sort by name descending
    var cursor = usersCollection.find({}, {sort:{"name": -1}}).toArray(function(e, data) {
      for(var i=0; i < data.length; i++) {
         console.log(data[i])
      }

    })

Limiting fields within find() results
'''''''''''''''''''''''''''''''''''''

You can limit the set of fields returned by find using
``options.projection`` argument. The ``projection`` argument can be
specified in the following form:

::


    {
      <field-path>: 0 | 1
    }

set field value to be 1 to include, 0 to exclude.

.. code:: javascript


    var usersCollection = client.getCollection("users")

    // find all users and get _id and name, address.city only
    usersCollection.find({}, {
        projection: {
          _id: 1,
          "name": 1,
          "address.city": 1
        }
       }).toArray(function(e, data) {
      for(var i=0; i < data.length; i++) {
         console.log(data[i])
      }

    })

    // exclude "address" only

    // find all users and get _id and name, address.city only
    usersCollection.find({}, {
        projection: {
          "address": 0
        }
       }).toArray(function(e, data) {
      for(var i=0; i < data.length; i++) {
         console.log(data[i])
      }

    })


^^^^^^^^^^^^
findObject()
^^^^^^^^^^^^

Finds the object with the specified object id.

Supported calling forms:

-  ``findObject(id, cb)``

^^^^^^^^
insert()
^^^^^^^^

Supported calling forms:

-  ``insert(obj, cb)``

.. code:: javascript

    usersCollection.insert({
        username: "joe"
      },
      function(e, result) {
        assert(result.ok) // true for success
        console.log(result)
      }
    )

^^^^^^^^
update()
^^^^^^^^

Supported calling forms:

-  ``update(query, obj, cb)``
-  ``update(query, obj, options, cb)```

^^^^^^^^^^^^^^
updateObject()
^^^^^^^^^^^^^^

Supported calling forms:

-  ``updateObject(id, update, cb)``


^^^^^^^^^^^^
saveObject()
^^^^^^^^^^^^

Supported calling forms:

-  ``saveObject(id, obj, cb)``


^^^^^^^^
remove()
^^^^^^^^

Supported calling forms:

-  ``remove(query, cb)``
-  ``remove(query, options, cb)``

^^^^^^^^^^^^^^
removeObject()
^^^^^^^^^^^^^^

Supported calling forms:

-  ``removeObject(id, cb)``

~~~~~~~~~~~~~~
Error handling
~~~~~~~~~~~~~~

Errors raised by CarbonClient are instances of the HttpError class
defined in `HttpErrors <https://github.com/carbon-io/http-errors>`__
module of carbon. An HttpError contains the http error code, message,
and description.


.. code:: javascript


    // GET http://localhost:8888/doesnotexit
    client.getEndpoint("doesnotexit").get(function(e, response) {
      if(e) {
          console.log("Caught an error")
          console.log("code: " + e.code); // 404
          console.log("message: " + e.message);
          console.log("description: " + e.description);
      }
    })

~~~~~~~~~~~~~
Endpoint Tree
~~~~~~~~~~~~~

As a convenience, ``Endpoint`` allow accessing sub-endpoints using the
``Endpoint.getEndpoint()`` method. You can also access the parent
Endpoint by ``Endpoint.parent``

.. code:: javascript


    e1 = client.getEndpoint("foo/bar")
    //is equivalent to
    e2 = client.getEndpoint("foo").getEndpoint("bar")

Endpoint full uri and absolute path can be accessed as follows

.. code:: javascript

    console.log(e1.getAbsolutePath()) // '/foo/bar'
    console.log(e2.getAbsolutePath()) // '/foo/bar' as well


    console.log(e1.getFullUrl()) // this will return client.uri + endpoint's absolute path which will be http://localhost:8888/foo/bar in this case

~~~~~~~~~~~~~~~
Passing Headers
~~~~~~~~~~~~~~~

Headers can be passed as JSON with the ``options.headers`` option. This
can be client-level or operation-level. This is an example of an
operation-level header passing.

.. code:: javascript

     // Plain text
     client.getEndpoint("hello").get({headers: {"Cache-Control": "no-cache"}},
         function(e, response) {
           console.log("Response from /hello: " + response.body)
       }
     )

~~~~~~~
Options
~~~~~~~

Options can be be set at client-level or operation-level.

To set options at the client level, it is passed with the "options"
constructor argument ``CarbonClient(url, options)``. For passing them on
the operation-level, it is passed with the "options" argument for each
endpoint http method.

.. code:: javascript

    //e.g
    endpoint.get(options, cb)

Supported options are as follows:

^^^^^^^^^^^^^^
Authentication
^^^^^^^^^^^^^^

Currently, CarbonClient only supports api-key authentication model.
CarbonClient allows Api key authentication by passing the api key value
in the header or query string. This will make the client send the api
key parameter in every request. See following example:

.. code:: javascript


    var client = new CarbonClient("http://localhost:8888", {
      authentication: {
        type: "api-key",
        apiKey:"123",
        apiKeyParameterName: "API_KEY", // the parameter name of the api key
        apiKeyLocation: "header" // use "query" for passing API_KEY using query string
      }
    })

^^^^^^^^^^^
SSL Options
^^^^^^^^^^^

SSL options are as follows:
``strictSSL: If true, requires SSL certificates be valid  cert: cert file content  key: key file content  ca: ca file content``

Here is an example of that

.. code:: javascript


    var defaultOptions = {
      cert: fs.readFileSync("/etc/myservice.cert.pem"),
      key: fs.readFileSync("/etc/myservice.key.pem"),
      ca: caFile ? fs.readFileSync("/etc/myservice.ca.cert.pem"),
      strictSSL: true
    }

    client = new CarbonClient(uri, defaultOptions);

^^^^^^^^^^^^^^^^^^^^^^^
JSON/Plain-text Results
^^^^^^^^^^^^^^^^^^^^^^^

All results are in JSON by default. For plain text, set ``options.json``
to false:

.. code:: javascript

     // Plain text
     client.getEndpoint("hello").get({json: false}, function(e, response) {
       console.log("Response from /hello: " + response.body)
     })

^^^^^^^^^
keepAlive
^^^^^^^^^

keepAlive can be set through the ``forever`` option

.. code:: javascript

    client = new CarbonClient(uri, {forever: true});

^^^^^^^
timeout
^^^^^^^

timeout can be set through the ``timeout`` option. Its an integer
representing timeout in milliseconds. This applies to both connection
and read timeouts.

.. code:: javascript

    client = new CarbonClient(uri, {timeout: true});
