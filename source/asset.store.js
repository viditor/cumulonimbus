var deepmerge = require("deepmerge")
var Bluebird = require("bluebird")
var uuid = require("node-uuid")
var mongojs = require("mongojs")

Database = mongojs("localhost", ["assets"])
Database.dropDatabase()

var AssetStore = new Object()

AssetStore.getAsset = function(asset)
{
    return new Bluebird(function(resolve, reject)
    {
        Database.assets.findOne(asset, function(error, asset)
        {
            if(error)
            {
                reject(error)
            }
            else if(!asset)
            {
                reject("Unavailable Asset")
            }
            else
            {
                resolve(asset)
            }
        })
    })
}

AssetStore.getAllAssets = function()
{
    return new Bluebird(function(resolve, reject)
    {
        Database.assets.find(function(error, assets)
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
    })
}

AssetStore.forEachAsset = function(callback)
{
    return new Bluebird(function(resolve, reject)
    {
        AssetStore.getAllAssets().then(function(assets)
        {
            for(var index in assets)
            {
                callback(assets[index], asset_id)
            }
            resolve(assets)
        })
    })
}

AssetStore.getAssetFile = function(asset, file_type)
{
    return new Bluebird(function(resolve, reject)
    {
        if(["mp4", "webm", "ogv"].indexOf(file_type) == -1)
        {
            reject("Unsupported Filetype")
        }
        else
        {
            AssetStore.getAsset(asset).then(function(asset)
            {
                resolve(asset.files[file_type])
            })
            .catch(function(error)
            {
                reject(error)
            })
        }
    })
}

AssetStore.addAsset = function(asset)
{
    return new Bluebird(function(resolve, reject)
    {
        if(asset === undefined)
        {
            asset = new Object()
        }
        
        asset.asset_id = uuid.v4()
        asset.date_created = Date.now()
        asset.date_touched = Date.now()
        
        Database.assets.save(asset, function()
        {
            trigger("add asset", asset)
            resolve(asset)
        })
    })
}

AssetStore.updateAsset = function(asset, updates)
{
    return new Bluebird(function(resolve, reject)
    {
        Database.assets.update(asset, updates, {multi: false}, function(error, asset)
        {
            trigger("update asset", assets)
            resolve(assets)
        })
    })
}

AssetStore.deleteAsset = function(asset)
{
    return new Bluebird(function(resolve, reject)
    {
        AssetStore.getAsset(asset).then(function(asset)
        {
            Database.assets.remove(asset, true, function(error)
            {
                if(error)
                {
                    reject(error)
                }
                else
                {
                    trigger("delete asset")
                    resolve(asset)
                }
            })
        })
        .catch(function(error)
        {
            reject(error)
        })
    })
}

AssetStore.deleteAllAssets = function()
{
    return new Bluebird(function(resolve, reject)
    {
        AssetStore.getAllAssets().then(function(assets)
        {
            Database.assets.remove({}, function(error)
            {
                if(error)
                {
                    reject(error)
                }
                else
                {
                    trigger("delete all assets")
                    resolve(assets)
                }
            })
        })
        .catch(function(error)
        {
            reject(error)
        })
    })
}

AssetStore.trigger = function(action, data)
{
    for(var index in this.listeners)
    {
        AssetStore.listeners[index](action, data)
    }
}

AssetStore.on = function(action, listener)
{
    if(!AssetStore.listeners)
    {
        AssetStore.listeners = new Array()
    }
    AssetStore.listeners.push(listener)
}
var trigger = AssetStore.trigger

module.exports = AssetStore
