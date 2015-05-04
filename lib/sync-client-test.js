RestClient = require('./RestClient').RestClient;
var spawn = require('fibers-utils').spawn;

spawn(
  function(){

    var client = new RestClient("http://localhost:9999");
    x = client.getEndpoint("status");
    data = x.get();
    console.log(data);

  }
);