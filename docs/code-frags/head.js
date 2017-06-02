//  call http HEAD method
client.getEndpoint("test-head").head(null,
  function(e, response) {
    console.log("Response from /test-head:")
    console.log(response.body)
  })