var express = require("express")
var bodyparser = require("body-parser")

var FusionRouter = express.Router()

FusionRouter["post"]("/", bodyparser.json(), function(request, response) {
	console.log(request.body)
	response.send({
		"format": "flv"
	})
})

module.exports = FusionRouter
