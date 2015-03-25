var express = require("express")
var AssetStore = require("./asset.store.js")

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
    
    AssetStore.getAssetFile({youtube_id: youtube_id}, file_type).then(function(asset_file)
    {
        response.status(200).send(asset_file)
    })
    .catch(function(error)
    {
        response.status(400).send(error)
    })
})

router["get"]("/:ytid", function(request, response)
{
    var youtube_id = request.params.ytid

    AssetStore.getAsset({youtube_id: youtube_id}).then(function(asset)
    {
        response.status(200).send(asset)
    })
    .catch(function(error)
    {
        response.status(400).send(error)
    })
})

router["post"]("/:ytid", function(request, response)
{
    var youtube_id = request.params.ytid
    
    AssetStore.addYoutubeAsset(youtube_id).then(function(asset)
    {
        response.status(200).send(asset)
    })
    .catch(function(error)
    {
        response.status(400).send(error)
    })
})

router["delete"]("/", function(request, response)
{
    var youtube_id = request.params.ytid
    
    AssetStore.deleteAllAssets().then(function(assets)
    {
        response.status(200).send(assets)
    })
    .catch(function(error)
    {
        response.status(400).send(error)
    })
})

router["delete"]("/:ytid", function(request, response)
{
    var youtube_id = request.params.ytid
    
    AssetStore.deleteAsset({youtube_id: youtube_id}).then(function(asset)
    {
        response.status(200).send(asset)
    })
    .catch(function(error)
    {
        response.status(400).send(error)
    })
})

module.exports = router
