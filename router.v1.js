router = module.exports = require("express").Router();

var database = {/*not actually the database*/};
database["hello"] = "world";

router.get("/youtube", function(request, response)
{
	response.send(database);
});

router.get("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	if(database[ytid])
	{
		response.send(200, database[ytid]);
	}
	else
	{
		response.send(404, "Invalid Youtube ID");
	}
});