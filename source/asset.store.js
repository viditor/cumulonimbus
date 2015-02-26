var deepmerge = require("deepmerge")
var Bluebird = require("bluebird")

var Asset = require("./asset.schema.js")

var AssetStore = function()
{
    this.listeners = new Object()
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
        Assets.find({}, function(error, assets)
        {
            if(error)
            {
                reject(error)
            }
            else
            {
                resolve(assets)
            }
        })
    }
    .bind(this))
}

AssetStore.prototype.addAsset = function(asset)
{
    return new Bluebird(function(resolve, reject)
    {
        if(asset === undefined)
        {
            asset = new Object()
        }
        if(asset.asset_id === undefined)
        {
            asset.asset_id = 1
        }
        if(asset.dates === undefined)
        {
            asset.dates = new Object()
        }
        if(asset.dates.created === undefined)
        {
            asset.dates.created = Date.now()
        }
        if(asset.dates.touched === undefined)
        {
            asset.dates.touched = Date.now()
        }
        if(asset.files === undefined)
        {
            asset.files = new Object()
        }

        this.assets[asset.asset_id] = asset
        this.trigger("add asset", asset)
        resolve(asset.asset_id)
    }
    .bind(this))
}

AssetStore.prototype.updateAsset = function(asset_id, reasset)
{
    return new Bluebird(function(resolve, reject)
    {
        var asset = this.assets[asset_id]

        this.assets[asset_id] = deepmerge(asset, reasset)
        this.trigger("update asset", this.assets[asset_id])
        resolve(asset_id)
    }
    .bind(this))
}

AssetStore.prototype.addAssetFile = function(asset_id, file_type, file_path)
{
    return new Bluebird(function(resolve, reject)
    {
        var asset = this.assets[asset_id]
        asset.files[file_type] = file_path

        this.trigger("update asset", asset)
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
