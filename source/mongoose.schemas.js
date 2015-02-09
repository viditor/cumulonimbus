var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var assetSchema = new Schema
({
    ytid: String,
    files:
    {
        original: String,
        mp4: String,
        webm: String, 
        ogv: String
    },
    dates:
    {
        created: Number,
        touched: Number
    }
});

assetSchema.methods.touch = function(callback)
{
    // Set a default callback if none unspecified
    if (typeof callback === "undefined")
    {
        callback = function(error)
        {
            if(error)
            {
                console.error("Could not update touch time on asset " + this.id);
            }
        };
    }

    this.dates.touched = Date.now();
    this.save(callback);
}

mongoose.model("Asset", assetSchema);