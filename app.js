var express = require("express");
var app = express();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var cors = require('cors');
var Files_Route = require('./routes/files');
var Mongoose = require("mongoose");
var config = require('./config');


Mongoose.connect(config.mongo.URL, { useNewUrlParser: true },(error)=>{
    if(error) console.log(error);
  });
  
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/files', Files_Route);

app.get('/', (req, res)=>{
    res.send('welcome!')
});
app.get('', (req, res)=>{
    res.send('?')
});

app.listen(process.env.PORT, ()=>{
    console.log('listening on port:' + process.env.PORT)
})