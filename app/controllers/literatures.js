/**
 * Module Dependencies
 */
var literatureModel = require('../models/literature');
var referenceModel = require('../models/reference');
var configModel = require('../models/global-config');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var moment = require('moment');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var hdfs = require('./hdfs');


exports.fetchById = function (req, res, next, id) {
  if (typeof parseInt(id) !== 'number') {
    next();
  }
  var literature = literatureModel.findById(id, function (err, results) {
    if (err) return next(err);
    if (results.length === 0) {
      return next({
        message: 'not found'
      });
    }
    var literature = wrapLiteratureForShow(results[0]);
    req.literature = literature;
    next();
  });
}

exports.fetchByTitle = function (req, res, next) {
  var title = req.query.title;
  literatureModel.findByTitle(title, 1, 10, function (err, results) {
    if (err) {
      res.send({
        error: err,
        success: false
      })
    }
    res.send({
      success: true,
      literatures: results
    })
  });
}

exports.showUploadPage = function (req, res) {
  configModel.findByTypes(['literature_type', 'reference_type'], function (err, results) {
    if (err) {
      return next(err);
    }
    var globalConfig = results[0];
    res.render('literatures/upload', {
      title: 'Upload literature',
      returnUrl: '',
      requestUrl: '/literatures',
      categories: JSON.parse(globalConfig.literature_type),
      referenceType: JSON.parse(globalConfig.reference_type)
    });
  });
}

exports.create = function (req, res, next) {
  var literature = req.body.literature;
  literature.user_id = req.user.id;
  //console.log(req.body);
  literatureModel.save(literature, function (err, result) {
    if (err) {
      return next(err);
    }
    //console.log(req.body.literature.references);
    if (result) {
      // Since object param is parsed by reference, so references is stringified now.
      var references = JSON.parse(literature.references);
      if (references.length === 0) {
        res.send({
          success: true,
          literatureId: result.insertId
        });
      } else {
        referenceModel.save(result.insertId, references, function (err, saveRes) {
          if (err) {
            return next(err);
          }
          //console.log('Save references ' + saveRes);
          res.send({
            success: true,
            literatureId: result.insertId
          });
        });
      }
    }
  });
}

exports.showUpdatePage = function (req, res, next) {
  var literature = req.literature;
  configModel.findByTypes(['literature_type', 'reference_type'], function (err, results) {
    if (err) {
      return next(err);
    }
    var globalConfig = results[0];
    res.render('literatures/update', {
      title: 'Update Literature',
      literature: literature,
      returnUrl: '/myliterature',
      requestUrl: '/literatures/update/' + literature.id,
      categories: JSON.parse(globalConfig.literature_type),
      referenceType: JSON.parse(globalConfig.reference_type)
    });
  });
}

exports.update = function (req, res, next) {
  // The literatureID for update
  var id = req.param('updateId');
  var literature = req.body.literature;
  literatureModel.update(id, literature, function (err, result) {
    if (err) {
      return next(err);
    }
    if (result) {
      //console.log(result);
      referenceModel.deleteByReference(id, function (err) {
        if (err) {
          return next(err);
        }
        var references = JSON.parse(literature.references);
          if (references.length === 0) {
            res.send({
              success: true,
              literatureId: id
            });
          } else {
            referenceModel.save(id, references, function (err, refSaveRes) {
              if (err) {
                return next(err);
              }
              //console.log(refSaveRes);
              res.send({
                success: true,
                literatureId: id
              });
            });
          }
      });
    }
  });
}

exports.showDetailPage = function (req, res) {
  var literature = req.literature;
  configModel.findByTypes(['reference_type', 'rich_comment'], function (err, results) {
    if (err) {
      return next(err);
    }
    var globalConfig = results[0];
    referenceModel.findByCited(literature.id, function (err, citedResults) {
      if (err) {
        throw err;
      }
      res.render('literatures/detail', {
        title: literature.title,
        literature: literature,
        referenceType: JSON.parse(globalConfig.reference_type),
        richCommentType: globalConfig.rich_comment,
        cited: citedResults
      });
    });
  });
}

exports.uploadFileLiterature = function (req, res) {
  var file = req.files.literature;
  //console.log(file);
  uploadFile(file, 'literatures', req.user.username, res);
}

exports.uploadFileAccessory = function (req, res) {
  var file = req.files.accessory;
  uploadFile(file, 'accessories', req.user.username, res);
}

exports.removeFile = function (req, res) {
  var filepath = req.body.filepath;
  console.log(filepath);
  fs.unlink(filepath, function (err) {
    if (err) {
      console.log(err);
      res.send({
        success: false,
        error: err
      });
    }

    // Delete the file from HDFS
    hdfs.deleteFile(filepath, function (err, stdout, stderr) {
      if (err) {
        console.log('HDFS delete err:' + err);
        res.send({
          success: false,
          errors: err
        });
      }
      console.log('HDFS Delete stdout: ' + stdout);
      console.log('HDFS Delete stderr: ' + stderr);
      res.send({success: true});
    });

  });
}

exports.downloadFile = function (req, res) {
  var filepath = req.query.filepath;
  // Load the file from HDFS when not exists on local file system
  fs.stat(filepath, function (err) {
    if (err) {
      hdfs.getFile(filepath, function (err, stdout, stderr) {
        if (err) {
          console.log('HDFS Get File Error: ' + err);
        } else {
          console.log('HDFS Get File stdout: ' + stdout);
          console.log('HDFS Get File stderr: ' + stderr);
          res.download(filepath);
        }
      });
    } else {
      res.download(filepath);
    }
  })
  //console.log(filepath);
  //var filename = path.basename(filepath);
  //res.download(filepath);
}

exports.showMyLiteraturePage = function (req, res, next) {
  var userid = req.user.id;
  literatureModel.findByUser(userid, function (err, results) {
    if (err) {
      return next(err);
    }
    //console.log(results);
    res.render('literatures/my-literature', {
      title: 'My Literature',
      literatures: results,
      moment: moment
    });
  });
}

exports.remove = function (req, res) {
  var id = req.param('removeId');
  literatureModel.delete(id, function (err, results) {
    if (err) {
      res.send({
        success: false,
        error: err
      });
    }
    res.send({
      success: true
    })
  });
}

exports.fetchCited = function (req, res) {
  var id = req.query.id;
  referenceModel.findByCited(id, function (err, results) {
    if (err) {
      res.send({
        success: false,
        error: err
      });
    }
    res.send({
      success: true,
      results: results
    });
  })
}

exports.fetchTags = function (req, res) {
  var id = req.query.literatureId;
  literatureModel.findTags(id, function (err, results) {
    if (err) {
      res.send({
        success: false,
        error: err
      });
    }
    var literature = results[0];
    res.send({
      success: true,
      tags: literature.tags
    });
  })
}


/**
 * Private Functions
 */

/**
 * Upload File to uploadDir defaults to 'root/uploads'
 * @param  {[file]} file
 * @param  {[String]} type 'literatures' or 'accessories'
 * @param  {[Object]} res      resoponse object
 */
var uploadFile = function (file, type, username, res) {
  var filename = file.originalFilename;
  var filepath = file.path;
  var filetype = file.type.split('/')[0];
  var filesize = getFileSize(file.size);
  var fileExtension = filepath.substr(filepath.lastIndexOf('.') + 1);

  var year = moment().format('YYYY');
  var month = moment().format('MM');
  var date = moment().format('DD');
  var uploadDir = config.uploadDir;
  var destDir = uploadDir + '/' + username + '/' + type + '/' + year + '/' + month + '/' + date;
  var serverpath = destDir + '/' + filename;
  mkdirp(destDir, function (err) {
    if (err) {
      console.log(err);
      res.send({success: false, errors: err});
    }
    fs.rename(filepath, serverpath, function (err) {
      if (err) {
        console.log(err);
        res.send({success: false, errors: err});
      }
      // Save file to HDFS
      hdfs.putFile(serverpath, function (err, stdout, stderr) {
        console.log('HDFS stdout: ' + stdout);
        console.log('HDFS stderr: ' + stderr);
        if (err) {
          console.log(err);
          res.send({success: false, errors: err});
        }
        res.send({
          success: true,
          file: {
            name: filename,
            type: filetype,
            size: filesize,
            extension: fileExtension,
            path: serverpath
          }
        });
      });
    });
  });
}

var getFileSize = function (size) {
  var res = '';
  if (size > 1000000) {
    size = Math.round(size / 1000000);
    res = size + 'MB';
  } else {
    size = Math.round(size / 1000);
    res = size + 'KB';
  }
  return res;
}

var wrapLiteratureForShow = function (literature) {
  literature.file = JSON.parse(literature.file);
  literature.accessories = JSON.parse(literature.accessories);
  literature.references = JSON.parse(literature.references);
  return literature;
}

