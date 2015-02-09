var fs = require("fs");
var path = require("path");
var youtube = require("./youtube.process");
var mongoose = require("mongoose");

var router = require("express").Router();

router["get"]("/", function(request, response)
{
    mongoose.model("Asset").find(function(error, data)
    {
        if(error || !data)
        {
            response.status(404).send("Could");
        }
        else
        {
            response.send(data);
        }
    })
});

router["get"]("/:ytid.:ext", function(request, response, next)
{
    var ytid = request.params.ytid;
    var ext = request.params.ext;
    
    if(["mp4", "webm", "ogv"].indexOf(ext) == -1)
    {
        response.status(400).send("Unsupported Filetype");
    }
    else
    {
        response.send("get a youtube video file");
        //asset.touch();
    }
});

router["get"]("/:ytid", function(request, response)
{
    var _ytid = request.params.ytid;

    mongoose.model("Asset").findOne({ytid: _ytid}, function(findError, asset)
    {

        if(findError || !asset)
        {
            response.send("Video with ytid " + _ytid + " is not on the server.");
        }
        else
        {
            asset.touch();
            response.send(asset);
        }
    })
});

router["post"]("/:ytid", function(request, response)
{
    var _ytid = request.params.ytid;

    console.log(Date.now(), "Beginning Youtube Download");
    youtube.download(_ytid).then(function()
    {
        console.log(Date.now(), "Finishing Youtube Download");

        mongoose.model("Asset").create
        ({
            ytid: _ytid,
            files:
            {
                original: "",
                mp4: "",
                webm: "", 
                ogv: ""
            },
            dates:
            {
                created: Date.now(),
                touched: Date.now()
            }
        });
    })

    response.send("Downloading http://www.youtube.com/watch?v=" + _ytid + " to the server.");
});

router["delete"]("/:ytid", function(request, response)
{
    var _ytid = request.params.ytid;
    
    response.send("add a youtube video");
});

module.exports = router;
