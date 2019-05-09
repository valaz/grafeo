#!/bin/bash
git remote add grafeo-dev-web dokku@dokku.valiev.top:grafeo-dev-web
git status
git stash
git push -f grafeo-dev-web monorepo:master