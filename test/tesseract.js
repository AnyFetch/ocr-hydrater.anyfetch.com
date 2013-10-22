'use strict';

require('should');

var tesseract = require('../lib/hydrater-tesseract');


var testTesseract = function(path, done) {
  var document = {
    metadatas: {}
  };

  tesseract(path, document, function(err, document) {
    if(err) {
      throw err;
    }

    document.should.have.property('binary_document_type', "image");
    document.should.have.property('metadatas');
    document.metadatas.should.have.property('text', "Tesseract sample image. The quick brown fox jumps over the lazy dog.\n\n");

    done();
  });
};

describe('Test tesseract results', function() {
  it('returns the correct informations for png image', function(done) {
    testTesseract(__dirname + '/samples/sample.png', done);
  });

  it('returns the correct informations for gif image', function(done) {
    testTesseract(__dirname + '/samples/sample.gif', done);
  });

  it('returns the correct informations for jpg image', function(done) {
    testTesseract(__dirname + '/samples/sample.jpg', done);
  });

  it('returns the correct informations for tif image', function(done) {
    testTesseract(__dirname + '/samples/sample.tif', done);
  });

  it('returns an error for non image', function(done) {
    var document = {
      metadatas: {}
    };

    tesseract(__filename, document, function(err) {
      if(!err) {
        throw new Error("Non image should not be allowed");
      }

      done();
    });
  });
});
