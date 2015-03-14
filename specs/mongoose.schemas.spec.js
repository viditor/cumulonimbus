var mongoose = require("mongoose");

xdescribe("Asset schema", function()
{
    it("allows creation of new assets", function(done)
    {
        require("../source/mongoose.connection");
        require("../source/mongoose.schemas");
        
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
            expect(errorA).toBeUndefined();
            expect(assetA).toBeDefined();

            assetA.touch(function()
            {
                var promiseB = mongoose.model("Asset").findOne({ytid: "TEST"}).exec();
                promiseB.then(function(errorB, assetB)
                {
                    expect(errorB).toBeUndefined();
                    expect(assetB).toBeDefined();
                    expect(assetB.dates.touched).not.toEqual(0);

                    done();
                });
            });
        });
    }, 250);

});
