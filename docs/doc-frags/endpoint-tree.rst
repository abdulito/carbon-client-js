-------------
Endpoint Tree
-------------

As a convenience, ``Endpoint`` allow accessing sub-endpoints using the
``Endpoint.getEndpoint()`` method. You can also access the parent
Endpoint by ``Endpoint.parent``

.. code:: javascript


    e1 = client.getEndpoint("foo/bar")
    //is equivalent to
    e2 = client.getEndpoint("foo").getEndpoint("bar")

Endpoint full uri and absolute path can be accessed as follows

.. code:: javascript

    console.log(e1.getAbsolutePath()) // '/foo/bar'
    console.log(e2.getAbsolutePath()) // '/foo/bar' as well


    console.log(e1.getFullUrl()) // this will return client.uri + endpoint's absolute path which will be http://localhost:8888/foo/bar in this case
