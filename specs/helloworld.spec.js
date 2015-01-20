var frisby = require("frisby");

var port = process.env.PORT || 8080;

var serverAddress = "http://localhost:" + port;

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
