*************
getCollection
*************

``getCollection()`` supports the following calling forms:

-  ``getCollection(path)``
-  ``getCollection(path, options)``

``options`` argument for ``getCollection`` support the following options:

- ``paginated``: Indicates if the collection should use pagination to fetch items. Pagination has to be supported by the server-side collection through the ``skip`` and ``limit`` params. See ``Cursors`` section for more info.
- ``batchSize``: Only supported with  paginated collections. Its control's pagination feature of the collection. It also can be set on the find operation level.

.. literalinclude:: code-frags/get-collection.js
    :language: javascript
    :linenos:
    :lines: 6-

