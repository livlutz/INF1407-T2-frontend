#!/bin/bash

cd web
python -m venv venv
source venv/bin/activate
cd public
python -m http.server 8080
cd Typescript
tsc --init
tsc -w
gh codespace ports visibility 8080:public
