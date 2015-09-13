#!/bin/sh

webpack
uglifyjs --screw-ie8 build.js > build_new.js
mv build_new.js build.js
zip -r whistlers_motive index.html build.js css/
du -b whistlers_motive.zip
