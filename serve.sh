#!/bin/sh
./build.sh
# serve project with thttpd
# root: docs/
PORT=1975
# no-cache, no chroot
thttpd -d docs -p $PORT -T utf-8 -M 1s
echo "[thttpd: listening on port localhost:$PORT]"
echo "To stop this service: killall thttpd."

