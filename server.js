var express = require("express");
var morgan = require("morgan");

var server = express();

server.use(morgan({format: "dev"}));

server.post("/v1/hello", function(request, response)
{
	response.json({hello: "world!"});
});

var port = process.env.PORT || 8080;
console.log("Listening on " + port);
server.listen(port);