var frisby = require("frisby");

var port = process.env.PORT || 8080;
var address = process.env.ADDRESS || "http://localhost";
var host = address + ":" + port;

frisby.create("Get a list of youtube videos")
    .get(host + "/v2/youtube")
    .expectStatus(200)
    .expectJSONTypes({
        
    })
    .toss();
