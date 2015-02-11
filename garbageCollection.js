#!/usr/bin/env node

// Tue Feb 10 13:39:21 2015 | 1423593561
// This is a garbage collection module which remove assets
// not touched after a certain period of time (currently 3 days).

var fs = require("fs");
var path = require("path");
var mongoose = require("mongoose");

var current = Date.now();
expirationDate = current - (3*24*60*60*1000); // days*hours*minutes*seconds*miliseconds

var ASSETS_DIRECTORY = __dirname + "/../assets/";

require("./source/mongoose.connection");
require("./source/mongoose.schemas");

mongoose.model("Asset").find(function(error, data)
    {
        if(error || !data)
        {
            console.log("Could not get list of assets.");
        }
        else
        {
            console.log(data);
        }
    });
                             
