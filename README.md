# Tesseract Cluestr Hydrater
> Visit http://cluestr.com for details about Cluestr.

Cluestr Hydrater for generic files

## How to install?
Vagrant up everything (`vagrant up`, `vagrant ssh`).

## How to deploy on heroku?
```sh
heroku config:add BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git
heroku config:set TESSERACT_OCR_LANGUAGES=fra
heroku config:set TESSERACT_OCR_REMOTE=https://s3.amazonaws.com/tesseract-ocr/heroku/tesseract-ocr-3.02.02.tar.gz
```

Support: `support@papiel.fr`.
