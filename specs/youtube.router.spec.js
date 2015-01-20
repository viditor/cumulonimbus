var frisby = require("frisby");

var port = process.env.PORT || 8080;
var address = process.env.ADDRESS || "http://localhost";
var server = address + ":" + port;

frisby.create("Get a youtube video file")
    .get(server + "/v2/youtube/XF7b_MNEIAg.mp4")
    .expectStatus(200)
    .toss();

frisby.create("Get a youtube video file with unsupported filetype")
    .get(server + "/v2/youtube/XF7b_MNEIAg.wmv")
    .expectStatus(400)
    .toss();
