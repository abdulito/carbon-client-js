---------------
Passing Headers
---------------


Headers can be passed as JSON with the ``options.headers`` option. This is an example of an operation-level header passing.

.. code:: javascript

     client.getEndpoint("hello").get({headers: {"Cache-Control": "no-cache"}},
         function(e, response) {
           console.log("Response from /hello: " + response.body)
       }
     )
