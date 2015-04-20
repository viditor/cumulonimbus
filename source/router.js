var router = require("express").Router();

router["get"]("/", function(request, response)
{
	//todo: return the api docs
    response.status(200).send("v2");
});

router.use("/youtube", require("./youtube.router.js"));
router.use("/fusion", require("./fusion.router.js"));

module.exports = router;
