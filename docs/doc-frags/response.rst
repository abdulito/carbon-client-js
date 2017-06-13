***************
Response object
***************

The Respone object ``res`` object that is returned by ``CarbonClient`` is the
response object from the Node.js ``request`` module which is an instance of  `http.IncomingMessage <https://nodejs.org/api/http.html#http_class_http_incomingmessage>`_

Some available fields are:

.. code:: javascript

    statusCode: <int>
    statusMessage: <str>
    headers: <object>
    body: response body
    httpVersion: <str>

