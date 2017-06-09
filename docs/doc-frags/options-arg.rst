
----------------
options argument
----------------

``options`` argument controls certain settings for requests made by the client.
``options`` can be provided at client-level or operation-level.


*************************
List of supported options
*************************

   * params
   * headers
   * timeout
   * forever
   * json
   * strictSSL
   * cert
   * key
   * ca
   * authentication (client-level only)


********************
Client-level options
********************

To set options at the client level, it is passed with the "options" constructor argument ``CarbonClient(url, options)``

.. code:: javascript

    // Create a client that will send a 'no-cache' header for all requests

    var client = new CarbonClient("http://localhost:8888", {
      headers: {"Cache-Control": "no-cache"}
    })

***********************
Operation-level options
***********************

For passing options at operation-level, it is passed with the "options" argument for each endpoint http method.

.. code:: javascript

    //e.g
    endpoint.get(options, cb)

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

    client = new CarbonClient(uri, defaultOptions)

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

    client = new CarbonClient(uri, {forever: true})

*******
timeout
*******

timeout can be set through the ``timeout`` option. Its an integer
representing timeout in milliseconds. This applies to both connection
and read timeouts.

.. code:: javascript

    client = new CarbonClient(uri, {timeout: true})