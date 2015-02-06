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
        var promiseA = mongoose.model("Asset").findOne({ytid: "TEST"}).exec();
        
        promiseA.then(function(errorA, assetA)
        {
            expect(errorA).toBeNull();
            expect(assetA).not.toBeNull();

            assetA.touch(function()
            {
                var promiseB = mongoose.model("Asset").findOne({ytid: "TEST"}).exec();
                promiseB.then(function(errorB, assetB)
                {
                    expect(errorB).toBeNull();
                    expect(assetB).not.toBeNull();
                    expect(assetB.dates.touched).not.toEqual(0);

                    done();
                });
            });
        });
    }, 250);

});
