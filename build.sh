#!/bin/sh

rm -rf docs/
mkdir docs
# copy all files in src/ to docs/
cp -r src/. docs
# compile .ts file in docs folder
tsc -p docs
# remove unnecessary files
rm -rf docs/*.ts docs/tsconfig.json
echo '[build: success]'
