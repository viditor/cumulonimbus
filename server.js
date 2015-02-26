//////////////
//Importing//
////////////

var http = require("http");
var express = require("express");
var socketio = require("socket.io");
var mongoose = require("mongoose");

var AssetStore = require("./source/asset.store.js");

////////////
//Routing//
//////////

application = express();
application["use"]("/v2", require("./source/router.js"));
application["use"]("/", require("./source/greet.router.js"));
application["all"]("*", function(request, response)
{
    response.status(404).send("put error message here");
});

////////////
//Serving//
//////////

port = process.env.PORT || 8080;
server = http.Server(application);
server.listen(port, function()
{
    console.log("Cumulonimbus is serving at " + port);
});

///////////////
//Databasing//
/////////////

mongoose.connect("mongodb://localhost");

mongoose.connection.on("connected", function()
{
    console.log("Cumulonimbus has connected to MongoDB");
});

mongoose.connection.on("disconnected", function()
{
    console.log("Cumulonimbus has disconnected from MongoDB");
});

mongoose.connection.on("error", function(error)
{
    console.log("MongoDB has had an error: " + error);
});

process.on("SIGINT", function()
{
    mongoose.connection.close(function()
    {
        process.exit(0);
    });
});

//////////////
//Streaming//
////////////

io = socketio(server);
io.on("connection", function(socket)
{
    var assets = MyAssets.getAllAssets()
    for(var video_id in assets)
    {
        var asset = assets[asset_id];
        socket.emit("add asset", asset);
    }

    AssetStore.on("add asset", function(asset)
    {
        socket.emit("add asset", asset);
    });
});

