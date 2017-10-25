-----------
Collections
-----------

CarbonClient provides convenient interfaces to access collection resources. A collection resources is allows access of
data members via http calls to ``/<collection>`` and ``/<collection>/:<id>``

CarbonClient collection can be accessed by the ``client.getCollection(path, options)`` method.

``Collection`` class provides the following methods:

- ``insert(objects, options, cb)``: issues a ``POST``  to ``/<collection>``
- ``find(options, cb)``: issues a ``GET`` to ``/<collection>``
- ``save(objects, options, cb)``: issues a ``PUT``  to ``/<collection>``
- ``update(update, options, cb)`: issues a ``GET``  to ``/<collection>``
- ``remove(options, cb)``: issues a ``DELETE``  to ``/<collection>``

- ``insertObject(object, options, cb)``: issues a ``POST``  to ``/<collection>:<id>``
- ``findObject(id, options, cb)``: issues a ``GET``  to ``/<collection>:<id>``
- ``saveObject(object, options, cb)``: issues a ``PUT``  to ``/<collection>:<id>``
- ``updateObject(id, update, options, cb)``: issues a ``PATCH``  to ``/<collection>:<id>``
- ``removeObject(id, options, cb)``: issues a ``DELETE``  to ``/<collection>:<id>``



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
