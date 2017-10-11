*******
toArray
*******

``Cursor.toArray()`` exhausts the cursor and returns all results into an array of objects.

NOTE:

- This could be memory consuming since results will be pulled into memory.
- Results will contain remaining results from where the cursor currently resides.

Supported calling forms for ``Cursor.toArray()`` are as follows:

-  toArray(cb)

.. literalinclude:: code-frags/to-array.js
    :language: javascript
    :linenos:
    :lines: 6-

This is an example of calling toArray() after moving the cursor once using ``Cursor.next()``:

.. literalinclude:: code-frags/to-array-partial.js
    :language: javascript
    :linenos:
    :lines: 6-