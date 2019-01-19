#!/bin/bash
git status
git stash
git checkout -f master
git rebase HEAD master
git push -f deploy master