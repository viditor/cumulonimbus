var express = require("express")
var bodyparser = require("body-parser")
var fusion = require("fusion")

var FusionRouter = express.Router()

FusionRouter["post"]("/", bodyparser.json(), function(request, response) {
	var protovideo = request.body
    fusion(protovideo).then(function(video) {
        response.status(200).send(video)
    }).catch(function(error) {
        console.log(error)
        response.status(400).send(error)
    })
})

module.exports = FusionRouter
