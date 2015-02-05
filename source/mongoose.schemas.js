var mongoose = require('mongoose');

var Schema = mongoose.Schema;

module.exports =
{
    loadSchemas: function()
    {
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

        assetSchema.methods.touch = function (_ytid, callback)
        {
            var query =
            {
                ytid: _ytid
            };

            var update =
            {
                dates:
                {
                    touched: Date.now()
                }
            };

            this.model('Asset').findOneAndUpdate(query, update, {}, callback);
        }

        mongoose.model("Asset", assetSchema);
    }
}
