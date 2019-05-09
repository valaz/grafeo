#!/bin/bash
git remote add grafeo-web dokku@dokku.valiev.top:grafeo-web
git remote add grafeo dokku@dokku.valiev.top:grafeo
git status
git stash
git push -f grafeo-web master
git push -f grafeo master