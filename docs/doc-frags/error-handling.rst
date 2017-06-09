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