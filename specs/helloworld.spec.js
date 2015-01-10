var helloworld = require("../helloworld.js");
var frisby = require("frisby");

var serverAddress = "http://localhost:3000";

frisby.create("Get greeting")
    .get(serverAddress + "/greet")
    .expectStatus(200)
    .expectHeaderContains("content-type", "text/html")
    .expectBodyContains("hello world")
    .toss();

frisby.create("Get square root of 65536")
    .get(serverAddress + "/sqrt?num=65536")
    .expectStatus(200)
    .expectHeaderContains("content-type", "text/html")
    .expectBodyContains("The square root of 65536 is 256")
    .toss();