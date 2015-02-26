var fs = require("fs")
var path = require("path")
var express = require("express")
var mongoose = require("mongoose")

var AssetStore = require("./AssetStore.js")
var youtube = require("./youtube.process.js")

var router = express.Router()

router["get"]("/", function(request, response)
{
    AssetStore.getAllAssets().then(function(assets)
    {
        response.status(200).send(assets)
    })
    .catch(function(error)
    {
        response.status(400).send(error)
    })
})

router["get"]("/:ytid.:ext", function(request, response, next)
{
    var ytid = request.params.ytid
    var ext = request.params.ext
    
    if(["mp4", "webm", "ogv"].indexOf(ext) == -1)
    {
        response.status(400).send("Unsupported Filetype")
    }
    else
    {
        AssetStore.getAssetFile(ytid, ext).then(function(asset_file)
        {
            response.status(200).send(asset_file)
        })
        .catch(function(error)
        {
            response.status(400).send(error)
        })
    }
})

router["get"]("/:ytid", function(request, response)
{
    var youtube_id = request.params.ytid

    AssetStore.getAsset(youtube_id).then(function(assets)
    {
        response.status(200).send(assets)
    })
    .catch(function(error)
    {
        response.status(400).send(error)
    })
})

router["post"]("/:ytid", function(request, response)
{
    var youtube_id = request.params.ytid

    console.log(Date.now(), "Beginning Youtube Download")
    youtube.download(youtube_id).then(function(asset_file)
    {
        console.log(asset_file);
        console.log(Date.now(), "Finishing Youtube Download")
        //add video to asset store
        //transcode video, add that to asset store
        //save all of this in a job store..?
    })

    response.send("Downloading " + youtube_id)
})

router["delete"]("/:ytid", function(request, response)
{
    var youtube_id = request.params.ytid
    
    response.send("Deleting " + youtube_id)
})

module.exports = router
