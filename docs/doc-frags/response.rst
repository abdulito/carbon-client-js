***************
Response object
***************

The ``response`` object that is returned by ``CarbonClient`` is the
response object from the Node.js ``request`` module. Full doc here
https://github.com/request/request

Some available fields are:

.. code:: javascript


    response.statusCode: http status code (int)
    response.headers: an object containing response headers
    response.body: response body