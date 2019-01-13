var express = require("express");
var app = express();
var http = require('http').Server(app);
var bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



var listener = http.listen(process.env.PORT || 3000,()=>{
    console.log('listening on port ' + listener.address().port);
  });