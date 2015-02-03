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

        assetSchema.methods.create = function (ytid, originalFile)
        {
            var fluffy = new Kitten({ name: 'fluffy' });
            var greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name"
            console.log(greeting);
        }
        mongoose.model("Asset", assetSchema);
    }
}
