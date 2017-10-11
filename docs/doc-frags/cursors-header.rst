-------
Cursors
-------

``Cursor`` objects are used for iterating over ``Collection.find(options)`` results. It provides the following methods:

- ``toArray(cb)``
- ``forEach(iterator, cb)``
- ``next(cb)``
- ``skip(val)`` (paginated collections only)
- ``limit(val)`` (paginated collections only)
- ``batchSize(val)`` (paginated collections only)
