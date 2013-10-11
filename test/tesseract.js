'use strict';

require('should');

var tesseract = require('../lib/hydrater-tesseract');


describe('Test tesseract results', function() {
  it('returns the correct informations for image', function(done) {
    var document = {
      metadatas: {}
    };

    tesseract(__dirname + '/sample.png', document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('binary_document_type', "text-image");
      document.should.have.property('text', "Tesseract sample image. The quick brown fox jumps over the lazy dog.\n\n");

      done();
    });
  });

  it('returns an error for non image', function(done) {
    var document = {
      metadatas: {}
    };

    tesseract(__filename, document, function(err, document) {
      if(!err) {
        throw new Error("Non image should not be allowed");
      }

      done();
    });
  });
});
