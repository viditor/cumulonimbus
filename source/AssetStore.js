var Bluebird = require("bluebird")

var AssetStore = function()
{
    this.assets = {}
    this.listeners = {}
}

AssetStore.prototype.getAsset = function(asset_id)
{
    return new Bluebird(function(resolve, reject)
    {
        if(asset_id == null)
        {
            reject(new Error("Invalid Asset ID"))
        }
        else
        {
            var asset = this.assets[asset_id]

            if(!asset)
            {
                reject(new Error("Asset doesn't exist"))
            }
            else
            {
                resolve(asset)
            }
        }
    }
    .bind(this))
}

AssetStore.prototype.getAllAssets = function()
{
    return new Bluebird(function(resolve, reject)
    {
        resolve(this.assets)
    }
    .bind(this))
}

AssetStore.prototype.addAsset = function()
{
    return new Bluebird(function(resolve, reject)
    {
        var asset = 
        {
            "asset_id": asset_id,
            "date": Date.now()
        }
        this.assets[asset_id] = asset

        this.trigger("add asset", asset)
        resolve(asset)
    }
    .bind(this))
}

AssetStore.prototype.nukeAssets = function()
{
    return new Bluebird(function(resolve, reject)
    {
        this.assets = {}

        this.trigger("nuke assets", this.assets)
        return this.assets
    }
    .bind(this))
}

AssetStore.prototype.trigger = function(action, data)
{
    if(this.listeners[action])
    {
        for(var index in this.listeners[action])
        {
            this.listeners[action][index](data)
        }
    }
}

AssetStore.prototype.on = function(action, listener)
{
    if(!this.listeners[action])
    {
        this.listeners[action] = []
    }

    this.listeners[action].push(listener)
}

module.exports = new AssetStore()
