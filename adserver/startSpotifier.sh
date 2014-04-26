#!/bin/sh
cd "$(dirname "$0")"
git pull
sudo npm install
sudo node spotifier.js
