-----------------------
Collections and Cursors
-----------------------

CarbonClient provides convenient interfaces to access collections. It
provides classes similar to MongoDB Driver Collection/Cursor classes.
You can perform ``find()``, ``insert()``, ``update()``,
``findObject()``, ``updateObject()``, ``saveObject()``, ``remove()``,
``removeObject()``.

Collection objects can be accessed by the ``client.getCollection()`` method.