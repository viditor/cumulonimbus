server = require("express")();
server.use(require("morgan")({format: "dev"}));
server.use("/v1", require("./router.v1.js"));

var port = process.env.PORT || 8080;
console.log("Listening on " + port);
server.listen(port);

mongoose = require("mongoose");
mongoose.connect("localhost/viditorcloud");