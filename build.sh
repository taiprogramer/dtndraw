#!/bin/sh

DIST=dist
rm -rf $DIST/ && mkdir $DIST
# copy all files in src/ to docs/
cp -r src/. $DIST
# compile .ts file in docs folder
tsc -p $DIST && echo '[build: success]'
# remove unnecessary files
rm -rf $DIST/*.ts $DIST/tsconfig.json

