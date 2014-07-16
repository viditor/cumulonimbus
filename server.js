var server = require("express")();

server.use(function(request, response, next)
{
	console.log("hello world!");
	
	next();
});

server.post("/v1/hello", function(request, response)
{
	response.json({hello: "world!"});
});

var port = process.env.PORT || 8080;
console.log("Listening on " + port);
server.listen(port);