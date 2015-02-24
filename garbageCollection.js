
// Tue Feb 10 13:39:21 2015 | 1423593561
// This is a garbage collection module which remove assets
// not touched after a certain period of time (currently 3 days).
//
// email section should be moved to a point after code has executed,
// Ideally it should also report what files have been deleted.
//
// use scheduleGarbageCollection.sh to install cron job to run script

var fs = require("fs");
var path = require("path");
var mongoose = require("mongoose");

var current = Date.now();
var expirationDate = current - (3*24*60*60*1000); // days*hours*minutes*seconds*miliseconds

var ASSETS_DIRECTORY = __dirname + "/assets/";

require("./source/mongoose.connection");
require("./source/mongoose.schemas");

var notifier = require("./notifyByMail.js");
var title = 'garbageCollection.js';
var message = 'garbageCollection has run';
notifier.notify(title,message);

mongoose.model("Asset").find(function(error, data)
    {
        if(error || !data)
        {
            console.log("Could not get list of assets.");
        }
        else
        {
            for (var index in data)
            {
                var touchDate = data[index].dates.touched;
                var items = data[index].files;
                if (expirationDate > touchDate)
                {
                    for (var i in items)
                    {
                        fs.unlink(ASSETS_DIRECTORY + items.original);
                        fs.unlink(ASSETS_DIRECTORY + items.ogv);
                        fs.unlink(ASSETS_DIRECTORY + items.webm);
                        fs.unlink(ASSETS_DIRECTORY + items.mp4);
                    }
                }
            }
            process.exit(); // this should not be necessary.
        }
    });
