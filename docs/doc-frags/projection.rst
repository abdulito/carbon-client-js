*************************************
Limiting fields within find() results
*************************************

You can limit the set of fields returned by find using
``options.projection`` argument. The ``projection`` argument can be
specified in the following form:

::


    {
      <field-path>: 0 | 1
    }

set field value to be 1 to include, 0 to exclude.

.. literalinclude:: code-frags/projection.js
    :language: javascript
    :linenos:
    :lines: 6-
