var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports =
{
    loadSchemas: function()
    {
        var assetSchema = new Schema
        ({
            files:
            {
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
        mongoose.model("Asset", assetSchema);
    }
}
