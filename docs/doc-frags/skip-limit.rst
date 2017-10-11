******************
skip/limit
******************

In paginated collections, and for server-side collections that honor the ``skip`` and ``limit`` parameters,
you can call ``Cursor.skip()`` and ``Cursor.limit()`` as a convenience for setting that:

.. literalinclude:: code-frags/skip-limit.js
    :language: javascript
    :linenos:
    :lines: 6-