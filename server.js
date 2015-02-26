var http = require("http");
var express = require("express");
var socketio = require("socket.io");

var AssetStore = require("./AssetStore.js");

/////////////////
//Initializing//
///////////////

var MyAssets = new AssetStore();

require("./source/mongoose.connection");
require("./source/mongoose.schemas");

////////////
//Routing//
//////////

application = express();
application.use("/v2", require("./source/router.js"));
application.use("/greet", require("./source/greet.router.js"));

var asset_id = 1;
application["get"]("/debug", function(request, response) {
    MyAssets.addAsset(asset_id++);
    response.status(200).send("OK");
});

application["all"]("*", function(request, response)
{
    response.status(404).send("put error message here");
});

////////////
//Serving//
//////////

var port = process.env.PORT || 8080;
var server = http.Server(application);
server.listen(port, function()
{
    console.log("Cumulonimbus is serving at " + port);
});

//////////////
//Streaming//
////////////

var io = socketio(server);
io.on("connection", function(socket)
{
    var assets = MyAssets.getAllAssets()
    for(var video_id in assets)
    {
        var asset = assets[asset_id];
        socket.emit("add asset", asset);
    }

    MyAssets.on("add asset", function(asset)
    {
        socket.emit("add asset", asset);
    });
});

