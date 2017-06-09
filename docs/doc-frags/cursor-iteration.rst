****************
Cursor iteration
****************

The ``Cursor.toArray()`` loads all results into a single array object
which could be memory consuming. To avoid that, use the
``Cursor.each()`` method which takes a function to iterate over each
item of results. It will return ``null`` when the cursor finishes.

.. literalinclude:: code-frags/each.js
    :language: javascript
    :linenos:
    :lines: 6-



Cursors also provide a ``next()`` method to iterate over a single item.
It will return ``null`` when the cursor finishes.

.. literalinclude:: code-frags/next.js
    :language: javascript
    :linenos:
    :lines: 6-