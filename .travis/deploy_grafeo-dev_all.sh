#!/bin/bash
git config --global push.default simple
git remote add grafeo-dev-web dokku@dokku.valiev.top:grafeo-dev-web
git remote add grafeo-dev dokku@dokku.valiev.top:grafeo-dev
git status
git stash
git push -f grafeo-dev-web dev:master
git push -f grafeo-dev dev:master