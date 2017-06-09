******
find()
******

The ``find()`` method invokes a ``find`` operation on the service collection and returns a ``Cursor`` object that is
used to iterate over results.

``find()`` supports the following calling forms

-  ``find(query)``
-  ``find(query, options)``

.. literalinclude:: code-frags/find.js
    :language: javascript
    :linenos:
    :lines: 6-