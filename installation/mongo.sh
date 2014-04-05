#!/bin/sh
cp ./mongodb.repo /etc/yum.repos.d/
su yum install mongo-10gen mongo-10gen-server
