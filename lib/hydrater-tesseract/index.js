'use strict';

/**
 * @file Helper for Tesseract file processing
 * For more information about Tesseract :
 * http://code.google.com/p/tesseract-ocr/
 */


/**
 * Extract the content of the specified image
 *
 * @param {string} path Path of the specified file
 * @param {string} attr Specific behavior for tika processing (html, metadata, text, language)
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
module.exports = function(path, document, cb) {
  var shellExec = require('child_process').exec;
  shellExec('tesseract ' + path, function(err, stdout, stderr) {
    if(err) {
      return cb(err);
    }
    if(stderr) {
      return cb(new Error(stderr));
    }

    document.text = stdout;
    document.binary_document_type = "text-image";
    
    cb(null, document);
  });
};
