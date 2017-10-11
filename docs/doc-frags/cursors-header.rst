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

*****************
How does it work?
*****************
