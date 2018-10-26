#!/usr/bin/env bash
docker_dir=`dirname $0`
sudo docker-compose -f $docker_dir/docker-compose.yml up