#!/bin/sh

rm -rf docs/
mkdir docs
# copy all files in src/ to docs/
cp -r src/. docs
# compile .ts file in docs folder
tsc -p docs && echo '[build: success]'
# remove unnecessary files
rm -rf docs/*.ts docs/tsconfig.json

