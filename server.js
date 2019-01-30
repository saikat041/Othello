var express = require('express');

app = express()
app.use(express.static(__dirname+'/public'))
var port = process.env.PORT || 8080

var server = app.listen(port, function(){
    var port = server.address().port
    console.log("Example app listening at : ", port)
})