var express = require("express")
var sendGreeting = require("./source/greeter").sendGreeting
var sendSqrt = require("./source/square-rooter").sendSqrt

var app = express()

app.get("/greet", sendGreeting)
app.get("/sqrt", sendSqrt)

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
