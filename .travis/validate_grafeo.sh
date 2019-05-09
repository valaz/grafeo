#!/bin/bash

response=$(curl https://api.grafeo.pro/api/common/fresh);

if [ "Started recently" == "${response}" ]; then
    echo "Success: server was started recently"
    exit 0
else
    echo "Failure: server was not started recently"
    echo ${response}
    exit 1
fi;