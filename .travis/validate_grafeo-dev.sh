#!/bin/bash

#response=$(curl https://dpi.grafeo.pro/api/common/fresh);
response=$(curl http://localhost:8090/api/common/fresh);

if [ "Started recently" == "${response}" ]; then
    echo "Success: server was started recently"
    exit 0
else
    echo "Failure: server was not started recently"
    echo ${response}
    exit 1
fi;