var fs = require("fs");
var path = require("path");
var youtube = require("./youtube.process");
var mongo = require("mongojs");

var db = mongo.connect("mongodb://localhost", ["assets"]);

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
    var _ytid = request.params.ytid;

    db.assets.findOne({ytid: _ytid}, function(error, asset)
    {
        if(error || !asset)
        {
            response.send("Video with ytid " + _ytid + " is not on the server.");
        }
        else
        {
            response.send(asset);
        }
    })
});

router["post"]("/:ytid", function(request, response)
{
    var ytid = request.params.ytid;

    console.log(Date.now(), "Beginning Youtube Download");
    youtube.download(ytid).then(function()
    {
        console.log(Date.now(), "Finishing Youtube Download");
        db.assets.save
        ({
            ytid: ytid,
            time: Date.now()
        });
    })

    response.send("Downloading http://www.youtube.com/watch?v=" + ytid + " to the server.");
});

router["delete"]("/:ytid", function(request, response)
{
    var ytid = request.params.ytid;
    
    response.send("add a youtube video");
});

module.exports = router;
