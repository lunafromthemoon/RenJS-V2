#!/bin/bash

VERSION=`node -p "require('./package.json').version"`

cp dist/renjs.js docs/downloads/releases/renjs-v$VERSION.js
cp dist/renjs.js docs/downloads/releases/renjs.js
cp dist/renjs.js RenJSQuickstart/renjs.js
cd RenJSQuickstart
bestzip ../docs/downloads/RenJSQuickstart.zip *