var frisby = require("frisby");

var port = process.env.PORT || 8080;
var address = process.env.ADDRESS || "http://localhost";
var server = address + ":" + port;

frisby.create("Get a greeting")
    .get(server + "/greet")
    .expectStatus(200)
    .expectHeaderContains("content-type", "text/html")
    .expectBodyContains("Hello World! :D")
    .toss();
