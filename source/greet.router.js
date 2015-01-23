var router = require("express").Router();

router["get"]("/", function(request, response)
{
	response.send("Hello World! :D")
});

module.exports = router;
