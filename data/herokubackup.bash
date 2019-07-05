#!/bin/bash

name=latest_backup.dump

if [[ $1 == "" ]]; then
 echo "requires app name"
 exit 1
fi
if [[ $2 != "" ]]; then
 name=$2
fi

name=".data/backups/$name"
echo -e "creating heroku backup for app $1 called $name \n\n"
heroku pg:backups:capture --app $1
heroku pg:backups:download --app $1 --output $name
echo "done"
exit 0