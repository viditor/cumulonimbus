var router = require("express").Router();

router.get("/", function(request, response)
{
    response.send("put youtube operations here");
});

module.exports = router;
