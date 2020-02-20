#!/bin/bash

# create dist/ if no exist
mkdir -p dist
# copy all files in src/ to dist/
cp -r src/. dist
# compile .ts file in dist folder
tsc -p dist

# serve project with http-server
# root: dist/
# port: 1975
# no-cache
http-server dist --port 1975 -c-1
