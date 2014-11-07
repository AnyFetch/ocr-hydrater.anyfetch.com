'use strict';

require('should');

var tesseract = require('../lib/');
var anyfetchHydrater = require('anyfetch-hydrater');

var HydrationError = anyfetchHydrater.HydrationError;

var testTesseract = function(path, done) {
  var document = {
    metadata: {
      path: "osef",
    }
  };

  var changes = anyfetchHydrater.defaultChanges();

  tesseract(path, document, changes, function(err, changes) {
    if (err) {
      throw err;
    }

    changes.should.have.property('metadata').and.have.property('text', "Tesseract sample image. The quick brown fox jumps over the lazy dog.\n\n");

    done();
  });
};

describe('Test tesseract results', function() {
  it('returns the correct informations for png image', function(done) {
    testTesseract(__dirname + '/samples/sample.png', done);
  });

  it('returns the correct informations for jpg image', function(done) {
    testTesseract(__dirname + '/samples/sample.jpg', done);
  });

  it('returns the correct informations for tif image', function(done) {
    testTesseract(__dirname + '/samples/sample.tif', done);
  });

  it('returns an errored document for non image', function(done) {
    var document = {
      metadata: {
        path: "osef",
      }
    };

    var changes = anyfetchHydrater.defaultChanges();

    tesseract(__filename, document, changes, function(err) {
      if(err instanceof HydrationError) {
        done();
      }
      else {
        done(new Error("invalid error"));
      }
    });
  });

  it('should return an errored document', function(done) {
    var document = {
      metadata: {
        path: "/samples/errored.osef",
      }
    };

    var changes = anyfetchHydrater.defaultChanges();

    tesseract(__dirname + "/samples/errored.osef", document, changes, function(err) {
      if(err instanceof HydrationError) {
        done();
      }
      else {
        console.log(changes);
        done(new Error("invalid error"));
      }
    });
  });

});
