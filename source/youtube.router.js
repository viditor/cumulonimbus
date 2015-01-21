var router = require("express").Router();
var youtubeDownloader = require("./youtube.downloader");

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
    
    response.send("get a youtube video");
});

router["post"]("/:ytid", function(request, response)
{
    var ytid = request.params.ytid;

    youtubeDownloader.download(ytid);

    response.send("Downloading http://www.youtube.com/watch?v=" + ytid + " to the server.");
});

router["delete"]("/:ytid", function(request, response)
{
    var ytid = request.params.ytid;
    
    response.send("add a youtube video");
});

module.exports = router;
