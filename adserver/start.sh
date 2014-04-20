#!/bin/sh
cd "$(dirname "$0")"
git pull
sudo node app.js
