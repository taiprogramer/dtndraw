#!/bin/bash
./build.sh
# serve project with http-server
# root: dist/
# port: 1975
# no-cache
http-server dist --port 1975 -c-1
