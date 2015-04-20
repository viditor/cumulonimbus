//////////////
//Importing//
////////////

var http = require("http")
var cors = require("cors")
var express = require("express")
var socketio = require("socket.io")

var AssetStore = require("./source/asset.store.js")
var YoutubeUtils = require("./source/youtube.process.js")

////////////
//Routing//
//////////

application = express()
application["use"](cors())
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
