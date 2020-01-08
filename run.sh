#!bin/bash

tsc
docker build -t virtual-lotto-simulator:1.0 .
docker create --name lotto-server -p 80:3000 virtual-lotto-simulator:1.0
docker cp ormconfig.json lotto-server:/usr/src/app
docker start -a lotto-server
