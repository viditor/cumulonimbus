var fs = require("fs")
var path = require("path")
var express = require("express")
var mongoose = require("mongoose")

var AssetStore = require("./asset.store.js")
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

router["get"]("/:ytid.:type", function(request, response, next)
{
    var youtube_id = request.params.ytid
    var file_type = request.params.type
    
    if(["mp4", "webm", "ogv"].indexOf(file_type) == -1)
    {
        response.status(400).send("Unsupported Filetype")
    }
    else
    {
        AssetStore.getAsset({youtube_id: youtube_id}).then(function(asset)
        {
            if(asset.files[file_type])
            {
                response.status(200).send(asset.files[file_type])
            }
            else
            {
                response.status(400).send("Nontranscoded Filetype")
            }
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
        response.status(200).send(asset_id)
        return asset_id
    })
    .then(function(asset_id)
    {
        return YoutubeUtils.download(asset_id, youtube_id)
    }
    .then(function(asset_id)
    {
        return asset_id
        //todo: transcode the asset into other formats.
    })
    .then(function(asset_id)
    {
        return AssetStore.getAsset(asset_id).then(function(asset)
        {
            console.log(asset)
        })
    })
    .catch(function(error)
    {
        //todo: nullify the partially download asset.
    })
})

router["delete"]("/:ytid", function(request, response)
{
    var youtube_id = request.params.ytid
    
    response.send("Deleting " + youtube_id)
})

module.exports = router
