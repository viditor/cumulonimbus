var mongoose = require("mongoose");

require("../source/mongoose.connection");
require("../source/mongoose.schemas");

describe("Asset schema", function()
{
    it("allows creation of new assets", function(done)
    {

        // Create dummy asset
        mongoose.model("Asset").create
        ({
            ytid: "TEST",
            dates:
            {
                created: Date.now(),
                touched: 0
            }
        })
        .then(function(error, asset)
        {
            done();
        });
    }, 250);


    it("updates the 'touched' date of the asset", function(done)
    {
        mongoose.model("Asset").findOne({ytid: "TEST"}, function(error, asset)
        {
            expect(error).toBeNull();
            expect(asset).not.toBeNull();

            asset.touch(function()
            {
                mongoose.model("Asset").findOne({ytid: "TEST"}, function(error, asset)
                {
                    expect(error).toBeNull();
                    expect(asset).not.toBeNull();
                    expect(asset.dates.touched).not.toEqual(0);

                    done();
                });
            });
        });
    }, 250);

});
