const Router = require("express").Router();
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const FileDB = require("../db/files");
const { check, validationResult } = require('express-validator/check');
const Jimp = require('jimp');

Router.get('/:file', (req, res) => {
  fs.exists(__dirname + '/../uploads/' + req.params.file, (exists) => {
    if (!exists) return res.status(500).json({ "erroe": "File Not Found!" });
    res.status(200).sendFile(path.resolve(__dirname + '/../uploads/' + req.params.file));
  });
});


Router.post('/upload', (req, res) => {

  files = [],
    form = new formidable.IncomingForm();

  form.multiples = true;
  form.keepExtensions = true;

  let UploadDir = path.join(__dirname + '/../uploads');

  fs.exists(UploadDir, (exists) => {
    if (!exists) fs.mkdir(UploadDir, err => console.log(err));

    form.uploadDir = UploadDir;

    form.on('file', function (field, file) {
      info = path.parse(file.path);
      files.push(info['base']); //
    });

    form.on('error', function (err) {
      return res.status(500).json({ "error": err });
    });

    form.on('end', function () {
      var Prepare = [];
      var promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          FileDB({
            fileName: file,
            file_url: config.app.upload_url + file
          }).save((err, file) => {
            if (err) return reject(err);
            Prepare.push({
              'id': file._id,
              'fileName': file.fileName,
              'file_url': config.app.upload_url + file.fileName
            });
            resolve();
          })
        })
      });
      Promise.all(promises).then(() => {
        res.status(200).send(Prepare);
      });
    });

    form.parse(req);

  });

});



Router.post('/resize', [
  check('width').isNumeric(),
  check('height').isNumeric(),
  check('files').not().isEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let files = JSON.parse(req.body['files']);
  let width = parseInt(req.body['width']);
  let height = parseInt(req.body['height']);
  let UploadDir = path.join(__dirname + '/../uploads');
  let perfix = width + '_' + height + '_';

  var promises = files.map(file => {
    return new Promise((resolve, reject) => {

      if (fs.existsSync(path.join(UploadDir + '/' + perfix + file))) {
        return resolve(perfix + file); // file already resized before so no need to continue
      }

      Jimp.read(path.join(UploadDir + '/' + file)).then((image) => {
        image.resize(width, height)
          .write(path.join(UploadDir + '/' + perfix + file));
        return resolve(perfix + file);
      }).catch((error) => {
        return reject(error);
      })
    })
  });

  Promise.all(promises).then((results) => {
    res.status(200).json(results);
  }).catch((error) => {
    res.status(422).json(error);
  });

});





Router.post('/crop', [
  check('width').isNumeric(),
  check('height').isNumeric(),
  check('x').isNumeric(),
  check('y').isNumeric(),
  check('files').not().isEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let files = JSON.parse(req.body['files']);
  let width = parseInt(req.body['width']);
  let height = parseInt(req.body['height']);
  let x = parseInt(req.body['x']);
  let y = parseInt(req.body['y']);
  let UploadDir = path.join(__dirname + '/../uploads');
  let perfix = 'corp_' + x + '_' + y + '_' + width + '_' + height + '_';


  var promises = files.map(file => {
    return new Promise((resolve, reject) => {

      if (fs.existsSync(path.join(UploadDir + '/' + perfix + file))) {
        return resolve(perfix + file); // file already croped before so no need to continue
      }

      Jimp.read(path.join(UploadDir + '/' + file)).then((image) => {
        image.crop(x, y, width, height)
          .write(path.join(UploadDir + '/' + perfix + file));
        return resolve(perfix + file);
      }).catch((error) => {
        return reject(error);
      })
    })
  });

  Promise.all(promises).then((results) => {
    res.status(200).json(results);
  }).catch((error) => {
    res.status(422).json(error);
  });

});




Router.post('/scale', [
  check('size').isNumeric(),
  check('files').not().isEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let files = JSON.parse(req.body['files']);
  let size = parseFloat(req.body['size']);
  let UploadDir = path.join(__dirname + '/../uploads');
  let perfix = 'scale_' + String(size).replace('.', '_') + '_';


  var promises = files.map(file => {
    return new Promise((resolve, reject) => {

      if (fs.existsSync(path.join(UploadDir + '/' + perfix + file))) {
        return resolve(perfix + file); // file already croped before so no need to continue
      }

      Jimp.read(path.join(UploadDir + '/' + file)).then((image) => {
        image.scale(size)
          .write(path.join(UploadDir + '/' + perfix + file));
        return resolve(perfix + file);
      }).catch((error) => {
        return reject(error);
      })
    })
  });

  Promise.all(promises).then((results) => {
    res.status(200).json(results);
  }).catch((error) => {
    res.status(422).json(error);
  });

});

Router.post('/blur', [
  check('files').not().isEmpty(),
  check('amount').isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let files = JSON.parse(req.body['files']);
  let amount = parseFloat(req.body['amount']);
  let UploadDir = path.join(__dirname + '/../uploads');
  let perfix = 'blur_' + amount + '_';

  var promises = files.map(file => {
    return new Promise((resolve, reject) => {

      if (fs.existsSync(path.join(UploadDir + '/' + perfix + file))) {
        return resolve(perfix + file); // file already croped before so no need to continue
      }

      Jimp.read(path.join(UploadDir + '/' + file)).then((image) => {
        image.blur(amount)
          .write(path.join(UploadDir + '/' + perfix + file));
        return resolve(perfix + file);
      }).catch((error) => {
        return reject(error);
      })
    })
  });


})

module.exports = Router;