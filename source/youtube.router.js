var fs = require("fs")
var path = require("path")
var express = require("express")
var mongoose = require("mongoose")

var AssetStore = require("./AssetStore.js")
var YoutubeUtils = require("./youtube.process.js")

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

    //todo: check if youtube_id is valid.
    //todo: check that the asset doesn't already exist.

    AssetStore.addAsset().then(function(asset_id)
    {
        YoutubeUtils.download(asset_id, youtube_id).then(function(stuff)
        {
            AssetStore.getAsset(asset_id).then(function(asset)
            {
                console.log(asset)
            })
        })
    })

    response.status(200).send("Downloading " + youtube_id)
})

router["delete"]("/:ytid", function(request, response)
{
    var youtube_id = request.params.ytid
    
    response.send("Deleting " + youtube_id)
})

module.exports = router
