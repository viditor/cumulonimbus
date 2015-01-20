module.exports =
{
    sendSqrt: function(request, response)
    {
        var num = request.query.num;
        response.send("The square root of " + num + " is " + Math.sqrt(num));
    }
}
