var Router = require("express").Router();
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var FileDB = require("../db/files");



Router.get('/', (req,res)=>{
    res.send("ok!")

});


Router.get('/:file', (req,res)=>{
    fs.exists(__dirname + '/../uploads/'  + req.params.file, (exists)=>{
        if( !exists) return res.status(500).json({"message": "File Not Found!"});
        res.status(200).sendFile(path.resolve(__dirname + '/../uploads/' + req.params.file));
    });
});




Router.post('/upload', (req,res)=>{
    
  files = [],
  form = new formidable.IncomingForm();

  form.multiples = true;
  form.keepExtensions = true;

  let UploadDir = path.join( __dirname + '../uploads');

  fs.exists(UploadDir, (exists)=>{
     if( !exists) fs.mkdir(UploadDir, err => console.log(err));
  
   form.uploadDir = UploadDir;

   form.on('file', function(field, file) {
     info = path.parse(file.path);
     files.push(info['base']); //
   });

   form.on('error', function(err) {
     return res.status(500).json({"message": err});
   });
 
   form.on('end', function() {
    var Prepare = [];
    var promises = files.map((file)=>{
       return new Promise((resolve, reject)=>{
           let myFile = new FileDB({
            fileName: file,
            file_url:  config.app.upload_url + file
            }).save((err, file)=>{
            if(err) return reject(err);
            Prepare.push({
             'id': file._id,
             'fileName': file.fileName,
             'file_url': config.app.upload_url + file.fileName
            });
            resolve();
           })
       })
     });
     Promise.all(promises).then(()=>{
      res.status(200).send(Prepare);
     });
   });

   form.parse(req);
 
 });



})
 


module.exports = Router;