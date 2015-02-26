//////////////
//Importing//
////////////

var http = require("http")
var express = require("express")
var socketio = require("socket.io")
var mongoose = require("mongoose")

var AssetStore = require("./source/asset.store.js")
var YoutubeUtils = require("./source/youtube.process.js")

////////////
//Routing//
//////////

application = express()
application["use"]("/v2", require("./source/router.js"))
application["use"]("/", require("./source/greet.router.js"))
application["all"]("*", function(request, response)
{
    response.status(404).send("put error message here")
})

////////////
//Serving//
//////////

port = process.env.PORT || 8080
server = http.Server(application)
server.listen(port, function()
{
    console.log("Cumulonimbus is serving at " + port)
})

///////////////
//Databasing//
/////////////

mongoose.connect("mongodb://localhost")

mongoose.connection.on("error", function(error)
{
    console.log("MongoDB has had an error: " + error)
})

process.on("SIGINT", function()
{
    mongoose.connection.close(function()
    {
        process.exit(0)
    })
})

//////////////
//Streaming//
////////////

io = socketio(server)
io.on("connection", function(socket)
{
    AssetStore.forEachAsset(function(asset)
    {
        socket.emit("add asset", asset)
    })

    AssetStore.on("add asset", function(asset)
    {
        socket.emit("add asset", asset)
    })

    AssetStore.on("update asset", function(asset)
    {
        socket.emit("update asset", asset)
    })

    socket.on("add asset from youtube", function(youtube_id)
    {
        AssetStore.addAsset().then(function(asset_id)
        {
            return YoutubeUtils.download(asset_id, youtube_id)
        })

        //todo: DRY this off; this code already lives
        //in ./youtube.router.js, but is inaccessible.
    })
})

