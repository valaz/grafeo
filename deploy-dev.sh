#!/bin/bash
git status
git stash
git checkout -f dev
git rebase HEAD dev
git push -f deploy-dev dev:master