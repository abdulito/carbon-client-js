****
find
****

``find()`` invokes a ``find`` operation on the service collection and returns a ``Cursor`` object that is
used for iterating over results.

``find()`` supports the following calling forms

-  ``find()``
-  ``find(options)``

.. literalinclude:: code-frags/find.js
    :language: javascript
    :linenos:
    :lines: 6-

In addition to globally supported options (See "Options argument section"), options argument for ``find`` support the following options:

- ``skip``
- ``limit``
- ``batchSize``

For more info on these options, please refer to the ``Cursors`` section.

