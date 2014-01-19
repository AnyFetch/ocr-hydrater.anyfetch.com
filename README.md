# Tesseract AnyFetch Hydrater
> Visit http://anyfetch.com for details about AnyFetch.

AnyFetch Hydrater for image files.

## How to deploy on heroku?
```sh
heroku config:add BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git
heroku config:set TESSERACT_OCR_LANGUAGES=fra
heroku config:set TESSERACT_OCR_REMOTE=https://s3.amazonaws.com/tesseract-ocr/heroku/tesseract-ocr-3.02.02.tar.gz
```

Support: `support@papiel.fr`.
