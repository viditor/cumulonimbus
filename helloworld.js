var express = require('express')

var app = express()

app.get('/greet', sendGreeting)
app.get('/sqrt', sendSqrt)

var server = app.listen(3000, function () {
	var host = server.address().address
	var port = server.address().port

	console.log('Example app listening at http://%s:%s', host, port)
})

function sendGreeting(request, response) {
	response.send('hello world');
}

function sendSqrt(request, response) {
	var num = request.query.num;
	response.send('The square root of ' + num + ' is ' + Math.sqrt(num));
}

