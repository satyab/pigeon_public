#!/bin/sh
cd "$(dirname "$0")"
git pull
sudo sails lift
