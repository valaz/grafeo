#!/bin/bash
git remote add grafeo-dev dokku@dokku.valiev.top:grafeo-dev
git status
git stash
git push -f grafeo-dev monorepo:master