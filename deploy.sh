#!/bin/bash
./build.sh
cd dist
rm -rf .git
git init
git add .
git commit -m "commit message"
git remote add origin git@github.com:taiprogramer/dtndraw.git
git push -f origin master:gh-pages
cd -