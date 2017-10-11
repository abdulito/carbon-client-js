-----------
Collections
-----------

CarbonClient provides convenient interfaces to access collection resources. Collection objects can be accessed
by the ``client.getCollection(path, options)`` method.

``Collection`` class provides the following methods:

- ``insert(objects, options, cb)``
- ``find(options)``
- ``save(objects, options, cb)``
- ``update(update, options, cb)``
- ``remove(options, cb)``
- ``insertObject(object, options, cb)``
- ``findObject(id, options, cb)``
- ``saveObject(object, options, cb)``
- ``updateObject(id, update, options, cb)``
- ``removeObject(id, options, cb)``

Which results in the following tree of endpoint calls:

- ``/<collection>``

  - ``POST`` which maps to `Collection.insert` and ```insertObject``
  - ``GET`` which maps to ```Collection.find``
  - ``PUT`` which maps to ```Collection.save`
  - ``PATCH`` which maps to ``Collection.update``
  - ``DELETE`` which maps to ``Collection.remove``

- ``/<collection>/:<id>``

  - ``GET`` which maps to ``Collection.findObject``
  - ``PUT`` which maps to ``Collection.saveObject``
  - ``PATCH`` which maps to ``updateObject``
  - ``DELETE`` which maps to ``removeObject``


*************
getCollection
*************

``getCollection()`` supports the following calling forms:

-  ``getCollection(path)``
-  ``getCollection(path, options)``

``options`` argument for ``getCollection`` support the following options:

- ``paginated``: Indicates if the collection should use pagination to fetch items. Pagination has to be supported by the server-side collection through the ``skip`` and ``limit`` params. See ``Cursors`` section for more info.
- ``skip``
- ``limit``
- ``batchSize``

``skip``, ``limit``, and ``batchSize`` are supported for paginated collections only. They control pagination feature of the collection.
They also can be set on the find operation level

.. literalinclude:: code-frags/get-collection.js
    :language: javascript
    :linenos:
    :lines: 6-