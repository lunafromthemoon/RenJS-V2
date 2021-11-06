#!/bin/bash

VERSION=`node -p "require('./package.json').version"`

cp dist/renjs.js docs/downloads/releases/renjs-v$VERSION.js
