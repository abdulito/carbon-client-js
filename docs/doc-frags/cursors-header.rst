-------
Cursors
-------

``Cursor`` objects are used for iterating over results for ``Collection.find(options)``. It provides the following methods:

- ``toArray(cb)``
- ``forEach(iterator, cb)``
- ``next(cb)``
- ``skip(val)`` (paginated collections only)
- ``limit(val)`` (paginated collections only)
- ``batchSize(val)`` (paginated collections only)

Since ``skip``, ``limit``, and ``batchSize`` are supported on the collection level (in ``getCollection(path, options)``),
specifying them on the Cursor level will override the collection level ones.