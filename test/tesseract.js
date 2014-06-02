'use strict';

require('should');

var tesseract = require('../lib/');
var anyfetchFileHydrater = require('anyfetch-file-hydrater');

var hydrationError = require('anyfetch-file-hydrater').hydrationError;

var testTesseract = function(path, done) {
  var document = {
    metadatas: {
      path: "osef",
    }
  };

  var changes = anyfetchFileHydrater.defaultChanges();

  tesseract(path, document, changes, function(err, changes) {
    if (err) {
      throw err;
    }

    changes.should.have.property('document_type', "image");
    changes.should.have.property('metadatas');
    changes.metadatas.should.have.property('text', "Tesseract sample image. The quick brown fox jumps over the lazy dog.\n\n");

    done();
  });
};

describe('Test tesseract results', function() {
  it('returns the correct informations for png image', function(done) {
    testTesseract(__dirname + '/samples/sample.png', done);
  });

  it('returns the correct informations for gif image', function(done) {
    var document = {
      metadatas: {
        path: "/samples/sample.gif",
      }
    };

    var changes = anyfetchFileHydrater.defaultChanges();

    tesseract(__dirname + '/samples/sample.gif', document, changes, function(err, changes){
      if(err) {
        throw err;
      }
      changes.should.be.eql(anyfetchFileHydrater.defaultChanges());

      done();

    });
  });

  it('returns the correct informations for gif content-type', function(done) {
    var document = {
      metadatas: {
        path: "/samples/bugged",
        'content-type': 'image/gif'
      },
    };

    var changes = anyfetchFileHydrater.defaultChanges();

    tesseract(__dirname + '/samples/bugged', document, changes, function(err, changes){
      if(err) {
        throw err;
      }
      changes.should.be.eql(anyfetchFileHydrater.defaultChanges());

      done();

    });
  });

  it('returns the correct informations for jpg image', function(done) {
    testTesseract(__dirname + '/samples/sample.jpg', done);
  });

  it('returns the correct informations for tif image', function(done) {
    testTesseract(__dirname + '/samples/sample.tif', done);
  });

  it('returns an errored document for non image', function(done) {
    var document = {
      metadatas: {
        path: "osef",
      }
    };

    var changes = anyfetchFileHydrater.defaultChanges();

    tesseract(__filename, document, changes, function(err) {
      if(err instanceof hydrationError) {
        done();
      }
      else {
        done(new Error("invalid error"));
      }
    });
  });

  it('should return an errored document', function(done) {
    var document = {
      metadatas: {
        path: "/samples/errored.psd",
      }
    };

    var changes = anyfetchFileHydrater.defaultChanges();

    tesseract(__dirname + "/samples/errored.psd", document, changes, function(err) {
      if(err instanceof hydrationError) {
        done();
      }
      else {
        done(new Error("invalid error"));
      }
    });
  });

});
