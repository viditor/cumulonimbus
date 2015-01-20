var router = require("express").Router();

router["get"]("/", function(request, response)
{
    response.send("get a list of all youtube videos");
});

router["get"]("/:ytid.:ext", function(request, response)
{
    var ytid = request.params.ytid;
    var ext = request.params.ext;
    
    response.send("get a youtube video file");
});

router["get"]("/:ytid", function(request, response)
{
    var ytid = request.params.ytid;
    
    response.send("get a youtube video");
});

router["post"]("/:ytid", function(request, response)
{
    var ytid = request.params.ytid;
    
    response.send("add a youtube video");
});

router["delete"]("/:ytid", function(request, response)
{
    var ytid = request.params.ytid;
    
    response.send("add a youtube video");
});

module.exports = router;
