******
update
******

Updates items matching specified ``query`` with  update object. Returns ``{"n": <integer>}`` indicating number of updated items.

Supported calling forms for ``Collection.update()`` are as follows:

-  ``update(query, obj, cb)``
-  ``update(query, obj, options, cb)```

.. literalinclude:: code-frags/update.js
    :language: javascript
    :linenos:
    :lines: 6-