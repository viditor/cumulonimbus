var express = require("express");

var app = express();

app.use("/v2", require("./source/router.js"));
app.use("/greet", require("./source/greet.router.js"));

app["all"]("*", function(request, response)
{
    response.status(404).send("put error message here");
});

var port = process.env.PORT || 8080;
var server = app.listen(port, function()
{
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

/*mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cumulonimbus");
mongoose.connection.on("open", function()
{
    console.log("Cumulonimbus is connected to MongoDB");
});*/
