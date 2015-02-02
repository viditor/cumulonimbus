var express = require("express")
var sendGreeting = require("./source/greeter").sendGreeting
var sendSqrt = require("./source/square-rooter").sendSqrt

require("./source/mongoose.schemas").loadSchemas();

var app = express()

app.get("/greet", sendGreeting)
app.get("/sqrt", sendSqrt)

app.use("/v2", require("./source/router.js"))

var port = process.env.PORT || 8080;

app["all"]("*", function(request, response)
{
    response.sendStatus(404);
    response.send("put error message here");
});

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
