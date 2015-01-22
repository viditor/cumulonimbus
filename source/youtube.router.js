var fs = require("fs");
var path = require("path");
var youtube = require("./youtube.process");

var router = require("express").Router();

router["get"]("/", function(request, response)
{
    response.send("get a list of all youtube videos");
});

router["get"]("/:ytid.:ext", function(request, response, next)
{
    var ytid = request.params.ytid;
    var ext = request.params.ext;
    
    if(["mp4", "webm", "ogv"].indexOf(ext) == -1)
    {
        response.sendStatus(400);
        response.send("Unsupported Filetype");
    }
    
    response.send("get a youtube video file");
});

router["get"]("/:ytid", function(request, response)
{
    var ytid = request.params.ytid;
    var file = ytid + ".flv";

    fs.exists(file, function(exists)
    {
        if(exists)
        {
            response.sendFile(path.join(__dirname, "../", file));
        }
        else
        {
            response.send("Video with ytid " + ytid + " is not on the server.");
        }
    });
});

router["post"]("/:ytid", function(request, response)
{
    var ytid = request.params.ytid;

    youtube.download(ytid);

    response.send("Downloading http://www.youtube.com/watch?v=" + ytid + " to the server.");
});

router["delete"]("/:ytid", function(request, response)
{
    var ytid = request.params.ytid;
    
    response.send("add a youtube video");
});

module.exports = router;
