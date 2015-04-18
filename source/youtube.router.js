var fs = require("fs")
var express = require("express")
var DataURI = require("datauri").promises
var AssetStore = require("./asset.store.js")
var YoutubeUtils = require("./youtube.process.js")
var FluentlyUtils = require("./fluently.process.js")

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

router["get"]("/:youtube_id.:file_format", function(request, response) {
    var youtube_id = request.params.youtube_id
    var file_format = request.params.file_format
    YoutubeUtils.download(youtube_id).then(function(video) {
        return FluentlyUtils.transcode(video.file_path, file_format).then(function(file_path) {
            video.initial_file_path = video.file_path
            video.file_path = file_path
            return video
        })
    }).then(function(video) {
        return DataURI(video.file_path).then(function(content) {
            video.content = content
            return video
        })
    }).then(function(video) {
        fs.unlink(video.initial_file_path)
        fs.unlink(video.file_path)
        delete video.initial_file_path
        delete video.file_path
        return video
    }).then(function(video) {
        response.status(200).send(video)
    }).catch(function(error) {
        response.status(400).send(error)
    })
})

router["get"]("/:youtube_id", function(request, response)
{
    var youtube_id = request.params.youtube_id

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
