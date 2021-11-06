#!/bin/bash

VERSION=`node -p "require('./package.json').version"`

mkdir .demo
cp dist/renjs.js .demo/renjs.js
cp dev-only/tutorial.html .demo/index.html
cp -r dev-only/story .demo/story
cp -r dev-only/assets .demo/assets
