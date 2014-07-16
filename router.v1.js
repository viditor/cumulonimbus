router = module.exports = require("express").Router();

router.get("/youtube", function(request, response)
{
	response.send({hello: "world"});
});