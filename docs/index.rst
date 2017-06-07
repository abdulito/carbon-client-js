.. _carbon-client:

=============================
carbon-client-js
=============================

--------
Overview
--------

``carbon-client-js`` is the Javascript client for Carbon.io services. As for Node.js, there is an extension for this driver with more Node.js abilities.
For more info, please refer to :ref:`carbon-client-node <carbon-client-node>`.

------------
Installation
------------


Download ``carbon-client.js`` and include carbon-client.js in your scripts and you are good to go!


.. code:: html

  <script src="build/carbon-client.js" type="application/javascript"></script>

------------------
Browser Compatibility
------------------

* Chrome
* Firefox

-----------
Quick Start
-----------

This is a simple example for an http get operation

.. literalinclude:: code-frags/quick-start.js
    :language: javascript
    :linenos:

----------------
Basic HTTP calls
----------------

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
    :lines: 6-

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
    :lines: 6-

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
    :lines: 6-

*********
PUT/PATCH
*********

``PUT``, ``PATCH`` can be performed with ``Endpoint.put()``,
``Endpoint.patch()`` methods respectively. Arguments of these methods
are all the same and similar to the ``Endpoint.post()`` method.

.. literalinclude:: code-frags/put.js
    :language: javascript
    :linenos:
    :lines: 6-

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

.. literalinclude:: code-frags/head.js
    :language: javascript
    :linenos:
    :lines: 6-

-----------------------
Collections and Cursors
-----------------------

CarbonClient provides convenient interfaces to access collections. It
provides classes similar to MongoDB Driver Collection/Cursor classes.
You can perform ``find()``, ``insert()``, ``update()``,
``findObject()``, ``updateObject()``, ``saveObject()``, ``remove()``,
``removeObject()``.

Collection objects can be accessed by the ``client.getCollection()`` method.

******
find()
******

The ``find()`` method invokes a ``find`` operation on the service collection and returns a ``Cursor`` object that is
used to iterate over results.

``find()`` supports the following calling forms

-  ``find(query)``
-  ``find(query, options)``

.. literalinclude:: code-frags/find.js
    :language: javascript
    :linenos:
    :lines: 6-

****************
Cursor iteration
****************

The ``Cursor.toArray()`` loads all results into a single array object
which could be memory consuming. To avoid that, use the
``Cursor.each()`` method which takes a function to iterate over each
item of results. It will return ``null`` when the cursor finishes.

.. literalinclude:: code-frags/each.js
    :language: javascript
    :linenos:
    :lines: 6-



Cursors also provide a ``next()`` method to iterate over a single item.
It will return ``null`` when the cursor finishes.

.. literalinclude:: code-frags/next.js
    :language: javascript
    :linenos:
    :lines: 6-

*****************
Cursor pagination
*****************

Pagination for results returned by ``find()`` can be achieved with
``skip`` and ``limit`` options through the ``options`` argument:

.. literalinclude:: code-frags/skip-limit.js
    :language: javascript
    :linenos:
    :lines: 6-

**********************
Sorting find() results
**********************

``options`` argument allows ``sort`` which takes a key to sort on:

.. literalinclude:: code-frags/sort.js
    :language: javascript
    :linenos:
    :lines: 6-

*************************************
Limiting fields within find() results
*************************************

You can limit the set of fields returned by find using
``options.projection`` argument. The ``projection`` argument can be
specified in the following form:

::


    {
      <field-path>: 0 | 1
    }

set field value to be 1 to include, 0 to exclude.

.. literalinclude:: code-frags/projection.js
    :language: javascript
    :linenos:
    :lines: 6-


************
findObject()
************

Finds the object with the specified object id.

Supported calling forms:

-  ``findObject(id, cb)``

.. literalinclude:: code-frags/find-object.js
    :language: javascript
    :linenos:
    :lines: 6-

********
insert()
********

Supported calling forms:

-  ``insert(obj, cb)``

.. literalinclude:: code-frags/insert.js
    :language: javascript
    :linenos:
    :lines: 6-



********
update()
********

Supported calling forms:

-  ``update(query, obj, cb)``
-  ``update(query, obj, options, cb)```

.. literalinclude:: code-frags/update.js
    :language: javascript
    :linenos:
    :lines: 6-

**************
updateObject()
**************

Supported calling forms:

-  ``updateObject(id, update, cb)``

.. literalinclude:: code-frags/update-object.js
    :language: javascript
    :linenos:
    :lines: 6-

************
saveObject()
************

Supported calling forms:

-  ``saveObject(id, obj, cb)``

.. literalinclude:: code-frags/save-object.js
    :language: javascript
    :linenos:
    :lines: 6-

********
remove()
********

Supported calling forms:

-  ``remove(query, cb)``
-  ``remove(query, options, cb)``

.. literalinclude:: code-frags/remove.js
    :language: javascript
    :linenos:
    :lines: 6-

**************
removeObject()
**************

Supported calling forms:

-  ``removeObject(id, cb)``

.. literalinclude:: code-frags/remove-object.js
    :language: javascript
    :linenos:
    :lines: 6-


--------------
Error handling
--------------

Errors raised by CarbonClient are instances of the HttpError class
defined in `HttpErrors <https://github.com/carbon-io/http-errors>`__
module of carbon. An HttpError contains the http error code, message,
and description.

.. literalinclude:: code-frags/error-handling.js
    :language: javascript
    :linenos:
    :lines: 6-

Output:

.. code::

    Caught an error
    code: 404
    message: Cannot GET /doesnotexit
    description: Not Found




-------------
Endpoint Tree
-------------

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

---------------
Passing Headers
---------------


Headers can be passed as JSON with the ``options.headers`` option. This
can be client-level or operation-level. This is an example of an
operation-level header passing.

.. code:: javascript

     client.getEndpoint("hello").get({headers: {"Cache-Control": "no-cache"}},
         function(e, response) {
           console.log("Response from /hello: " + response.body)
       }
     )

-------
Options
-------

Options can be be set at client-level or operation-level.

To set options at the client level, it is passed with the "options"
constructor argument ``CarbonClient(url, options)``. For passing them on
the operation-level, it is passed with the "options" argument for each
endpoint http method.

.. code:: javascript

    //e.g
    endpoint.get(options, cb)

Supported options are as follows:

**************
Authentication
**************

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

***********
SSL Options
***********

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

***********************
JSON/Plain-text Results
***********************

All results are in JSON by default. For plain text, set ``options.json``
to false:

.. code:: javascript

     // Plain text
     client.getEndpoint("hello").get({json: false}, function(e, response) {
       console.log("Response from /hello: " + response.body)
     })

*********
keepAlive
*********

keepAlive can be set through the ``forever`` option

.. code:: javascript

    client = new CarbonClient(uri, {forever: true});

*******
timeout
*******

timeout can be set through the ``timeout`` option. Its an integer
representing timeout in milliseconds. This applies to both connection
and read timeouts.

.. code:: javascript

    client = new CarbonClient(uri, {timeout: true});

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`