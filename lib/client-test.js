RestClient = require('./RestClient').RestClient;

var client = new RestClient("http://localhost:9999");

x = client.getEndpoint("status");

x.get(null, null, function(err, res, data){
  console.log(data);
});