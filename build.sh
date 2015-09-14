#!/bin/sh

webpack
uglifyjs build.js --screw-ie8 -c -m > build_new.js
mv build_new.js build.js
zip -r whistlers_motive index.html build.js css/
du -b whistlers_motive.zip
