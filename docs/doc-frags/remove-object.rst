************
removeObject
************

Removes object with the specified ``id``. If the object does not exist then it raise an error ``HttpError(404)``.

Supported calling forms for ``Collection.removeObject()`` are as follows:

-  ``removeObject(id, cb)``

.. literalinclude:: code-frags/remove-object.js
    :language: javascript
    :linenos:
    :lines: 6-