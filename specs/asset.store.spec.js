var Bluebird = require("bluebird");

var path = require("path");
var fs = Bluebird.promisifyAll(require("fs"));

var AssetStore = require("../source/asset.store.js");

describe("asset.store.js", function()
{
    var asset_id = null;
    
    it("can add an asset", function(done)
    {
        AssetStore.addAsset({"name": "test"}).then(function(asset)
        {
            asset_id = asset.asset_id
            expect(asset).toBeDefined()
            expect(asset.name).toBe("test")
        })
        .finally(function()
        {
            done()
        })
    });
    
    it("can get an asset", function(done)
    {
        AssetStore.getAsset({"asset_id": asset_id}).then(function(asset)
        {
            expect(asset).toBeDefined()
            expect(asset.name).toBe("test")
        })
        .finally(function()
        {
            done()
        })
    });
    
    it("can update an asset", function(done)
    {
        AssetStore.updateAsset({"asset_id": asset_id}, {"name": "tested"}).then(function(asset)
        {
            expect(asset).toBeDefined()
            expect(asset.name).toBe("tested")
        })
        .finally(function()
        {
            done()
        })
    });
    
    it("can delete an asset", function(done)
    {
        AssetStore.deleteAsset({"asset_id": asset_id}).then(function(asset)
        {
            expect(asset).toBeDefined()
            expect(asset.name).toBe("tested")
        })
        .finally(function()
        {
            done()
        })
    });
    
    it("can stop the database", function()
    {
        AssetStore.stop()
    });
});
