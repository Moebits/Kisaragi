#!/bin/bash

dbname=runon_dev
username=postgres
port=5432
host=localhost
if [[ $1 == "" ]]; then
 echo "provide path to dump file"
 exit 1
fi
echo -e "Restoring database from $1 \n\n"
psql
--dbname=$dbname
--file=$1
--echo-all
--echo-errors
--host=$host
--port=$port
--username=$username
echo "done"
exit 0