*******
forEach
*******

The ``Cursor.toArray()`` loads all results into a single array object
which could be memory consuming. To avoid that, use the ``Cursor.forEach()`` method which takes
a function to iterate over each item of results. cb(e) will be called when iteration ends.

Supported calling forms for ``Cursor.forEach()`` are as follows:

-  ``forEach(iterator, cb)``

.. literalinclude:: code-frags/for-each.js
    :language: javascript
    :linenos:
    :lines: 6-
