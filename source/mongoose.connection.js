var mongoose = require("mongoose");

var CONNECTION_STRING = "mongodb://localhost";

mongoose.connect(CONNECTION_STRING);

mongoose.connection.on("connected", function()
{
    console.log("Cumulonimbus is connected to MongoDB at " + CONNECTION_STRING);
});

mongoose.connection.on("disconnected", function()
{
    console.log("Cumulonimbus disconnected from MongoDB");
});

mongoose.connection.on("error", function(err)
{
    console.log("MongoDB connection error: " + err);
});

// Close the Mongoose connection when the Node process ends
process.on("SIGINT", function()
{
    mongoose.connection.close(function()
    {
        process.exit(0);
    });
});

