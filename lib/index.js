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

var anyfetchHydrater = require('anyfetch-hydrater');
var HydrationError = anyfetchHydrater.HydrationError;

/**
 * Extract the content of the specified image
 *
 * @param {string} path Path of the specified file
 * @param {string} document is the document to hydrate
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */

module.exports = function(path, document, changes, finalCb) {
  async.waterfall([
    function convertDocument(cb) {
      var outPath = '/tmp/' + crypto.randomBytes(20).toString('hex');
      // Tesseract is a huge pile of horse shit.
      // It can't return data on stderr "for lack of convenient argument parser". Srsly?
      // It automatically adds .txt extension. Because why?
      // It returns version information on stderr. Because why?

      shellExec('tesseract ' + path + " " + outPath, function(err) {
        if(err) {
          return cb(new HydrationError(err));
        }
        // Fuck you tesseract.
        outPath += ".txt";
        cb(null, outPath);
      });
    },
    function readChanges(outPath, cb) {
      fs.readFile(outPath, function(err, data) {
        cb(err, outPath, data);
      });
    },
    function removeGarbage(outPath, data, cb) {
      changes.metadata.text = rmgarbage(data.toString());

      cb(null, outPath);
    },
    function deleteConvertedDocument(outPath, cb) {
      fs.unlink(outPath, function() {
        cb();
      });
    },
  ], function(err) {
    changes.document_type = "image";
    finalCb(err, changes);
  });
};
