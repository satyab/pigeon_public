#!/bin/sh

# add entry to rc.local
sed -i s:"^exit 0":"/home/ubuntu/pigeon/start.sh \& \nexit 0": /etc/rc.local
