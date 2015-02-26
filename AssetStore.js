var AssetStore = function()
{
    this.assets = {};
    this.listeners = {};
}

AssetStore.prototype.getAsset = function(asset_id)
{
    if(!asset_id)
    {
        throw new Error("Invalid Asset ID")
    }

    if(!this.hasAsset(asset_id))
    {
        this.addAsset(asset_id)
    }

    return this.users[asset_id];
}

AssetStore.prototype.getAllAssets = function()
{
    return this.assets;
}

AssetStore.prototype.hasAsset = function(asset_id)
{
    if(!asset_id)
    {
        throw new Error("Invalid Asset ID")
    }

    return this.users[asset_id] != undefined;
}

AssetStore.prototype.addAsset = function(asset_id)
{
    if(!asset_id)
    {
        throw new Error("Invalid Asset ID")
    }

    var asset = 
    {
        "asset_id": asset_id,
        "date": Date.now()
    }

    this.assets[asset_id] = asset;

    this.trigger("add asset", asset);
    return asset;
}

AssetStore.prototype.nukeAssets = function()
{
    this.assets = {};

    this.trigger("nuke assets", this.assets);
    return this.assets;
}

AssetStore.prototype.trigger = function(action, data)
{
    if(this.listeners[action])
    {
        for(var index in this.listeners[action])
        {
            this.listeners[action][index](data);
        }
    }
}

AssetStore.prototype.on = function(action, listener)
{
    if(!this.listeners[action])
    {
        this.listeners[action] = [];
    }

    this.listeners[action].push(listener);
}

module.exports = AssetStore;
