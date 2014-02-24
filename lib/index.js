'use strict';

/**
 * @file Helper for Tesseract file processing
 * For more information about Tesseract :
 * http://code.google.com/p/tesseract-ocr/
 */

var fs = require('fs');
var async = require('async');
var shellExec = require('child_process').exec;
var crypto = require('crypto');


/**
 * Extract the content of the specified image
 *
 * @param {string} path Path of the specified file
 * @param {string} document is the document to hydrate
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
module.exports = function(path, document, cb) {
      // Skip GIF (pronouced "jif")
      if (path.indexOf('.gif') !== -1){
        // return null document to skip hydration
        return cb(null, null);
      }

  async.waterfall([
    function(cb) {
      var outPath = '/tmp/' + crypto.randomBytes(20).toString('hex');
      // Tesseract is a huge pile of horse shit.
      // It can't return datas on stderr "for lack of convenient argument parser". Srsly?
      // It automatically adds .txt extension. Because why?
      // It returns version information on stderr. Because why?
      
      shellExec('tesseract ' + path + " " + outPath, function(err) {
        // Fuck you tesseract.
        outPath += ".txt";
        cb(err, outPath);
      });
    },
    function(outPath, cb) {
      fs.readFile(outPath, function(err, data) {
        cb(err, outPath, data);
      });
    },
    function(outPath, data, cb) {
      if(!document.metadatas) {
        document.metadatas = {};
      }
      
      document.metadatas.text = data.toString();
      document.document_type = "image";

      cb(null, outPath);
    },
    function(outPath, cb) {
      fs.unlink(outPath, function() {
        cb();
      });
    },
  ], function(err) {
    cb(err, document);
  });
};
