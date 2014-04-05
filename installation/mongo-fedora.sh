#!/bin/sh
cp ./mongodb.repo /etc/yum.repos.d/
yum -y install mongo-10gen mongo-10gen-server
