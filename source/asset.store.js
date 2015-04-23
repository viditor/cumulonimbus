var path = require("path")
var UUID = require("node-uuid")
var MongoJS = require("mongojs")
var Bluebird = require("bluebird")
var FfmpegUtils = require("./fluently.process.js")
var YoutubeUtils = require("./youtube.process.js")

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

        asset.asset_id = UUID.v4()
        asset.date_created = Date.now()
        asset.date_touched = Date.now()

        Database.assets.save(asset, function()
        {
            trigger("add asset", asset)
            resolve(asset)
        })
    })
}

AssetStore.addYoutubeAsset = function(youtube_id)
{
    return new Bluebird(function(resolve, reject)
    {
        if(youtube_id.length != 11)
        {
            reject("Invalid Youtube ID")
        }
        else
        {
            AssetStore.addAsset({youtube_id: youtube_id}).then(function(asset)
            {
                YoutubeUtils.download(youtube_id, asset.asset_id, function(updates)
                {
                    return AssetStore.updateAsset({asset_id: asset.asset_id}, updates)
                })
                .then(function(asset)
                {
                    var assets_directory = path.join(__dirname, "/../assets")
                    return FfmpegUtils.webtranscode(assets_directory, asset.asset_id)
                })
                .then(function(files)
                {
                    console.log("done!", files)
                })
                resolve(asset)
            })
            .catch(function(error)
            {
                reject(error)
            })
        }
    })
}

AssetStore.updateAsset = function(asset, updates)
{
    return new Bluebird(function(resolve, reject)
    {
        Database.assets.findAndModify({query: asset, update: {$set: updates}, new: true}, function(error, asset)
        {
            trigger("update asset", asset)
            resolve(asset)
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
var trigger = AssetStore.trigger

AssetStore.on = function(action, listener)
{
    if(!AssetStore.listeners)
    {
        AssetStore.listeners = new Array()
    }
    AssetStore.listeners.push(listener)
}

AssetStore.stop = function()
{
    Database.close()
}

module.exports = AssetStore
