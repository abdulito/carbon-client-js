**********
saveObject
**********

Replace/create object with the specified ``id``. Returns true if the object did not exist indicating that the object was created. Otherwise, it will return false.

Supported calling forms for ``Collection.saveObject()`` are as follows:

-  ``saveObject(id, obj, cb)``
-  ``saveObject(id, obj, options, cb)``

.. literalinclude:: code-frags/save-object.js
    :language: javascript
    :linenos:
    :lines: 6-