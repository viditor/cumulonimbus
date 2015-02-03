var express = require("express");
var mongoose = require("mongoose");

require("./source/mongoose.connection");
require("./source/mongoose.schemas");

var app = express();

app.use("/v2", require("./source/router.js"));
app.use("/greet", require("./source/greet.router.js"));

app["all"]("*", function(request, response)
{
    response.sendStatus(404);
    response.send("put error message here");
});

var port = process.env.PORT || 8080;
var server = app.listen(port, function()
{
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
