
// Sun Feb 22 17:44:26 2015 | 1424645066
// module to wrap node-mailer in an accessable function to code.

var keys   = require('./mailKeys.js');
// mailKeys.js follows this structure
// exports.mailAddress   = '[INSERT emailaddress]';
// exports.cryptPassword = '[INSERT a password for cryptkey]';
// exports.hashValue     = '[INSERT an encrypted password value]';

var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = keys.cryptPassword;

function decrypt(text)
{ 
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport(
{
    service: 'gmail',
    auth:
    {
        user: keys.mailAddress,       // Where privacy isn't an issue these can be let go.
        pass: decrypt(keys.hashValue),
    }
});

module.exports =
{
    notify: function notifyByMail(title, message)
    {
        transporter.sendMail(
            {
                from: keys.mailAddress,
                to:   keys.mailAddress,
                subject: title,
                text: message
            });
        return;
    }
};
