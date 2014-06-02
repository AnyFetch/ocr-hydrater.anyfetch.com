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
var rmgarbage = require('rmgarbage');

var anyfetchFileHydrater = require('anyfetch-file-hydrater');
var hydrationError = anyfetchFileHydrater.hydrationError;

/**
 * Extract the content of the specified image
 *
 * @param {string} path Path of the specified file
 * @param {string} document is the document to hydrate
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */

function isGif(document){
  if(document.metadata['content-type'] && document.metadata['content-type'] === "image/gif") {
    return true;
  }
  if(document.metadata.path.indexOf('.gif') !== -1 || document.metadata.path.indexOf('.GIF') !== -1) {
    return true;
  }
  return false;
}


module.exports = function(path, document, changes, finalCb) {
  // Skip GIF (pronouced "jif")
  if(isGif(document)) {
    return finalCb(null, changes);
  }

  async.waterfall([
    function(cb) {
      var outPath = '/tmp/' + crypto.randomBytes(20).toString('hex');
      // Tesseract is a huge pile of horse shit.
      // It can't return data on stderr "for lack of convenient argument parser". Srsly?
      // It automatically adds .txt extension. Because why?
      // It returns version information on stderr. Because why?

      shellExec('tesseract ' + path + " " + outPath, function(err) {
        if(err) {
          return cb(new hydrationError(err));
        }
        // Fuck you tesseract.
        outPath += ".txt";
        cb(null, outPath);
      });
    },
    function(outPath, cb) {
      fs.readFile(outPath, function(err, data) {
        cb(err, outPath, data);
      });
    },
    function(outPath, data, cb) {
      changes.metadata.text = rmgarbage(data.toString());
      changes.document_type = "image";

      cb(null, outPath);
    },
    function(outPath, cb) {
      fs.unlink(outPath, function() {
        cb();
      });
    },
  ], function(err) {
    finalCb(err, changes);
  });
};
