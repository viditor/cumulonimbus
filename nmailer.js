var nodemailer = require("nodemailer");

Asset = require("./asset.schema.js");
Asset.remove({}, function(error) {});

var transport = nodemailer.createTransport("SMTP", {service: "gmail", auth: require("./volatile_data/gmail.account.js")});