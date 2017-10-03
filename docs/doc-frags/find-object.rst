**********
findObject
**********

Finds object with the specified ``id``. If the object does not exist then it will return ``null``.

Supported calling forms for ``Collection.findObject()`` are as follows:

-  ``findObject(id, cb)``
-  ``findObject(id, options, cb)``

.. literalinclude:: code-frags/find-object.js
    :language: javascript
    :linenos:
    :lines: 6-