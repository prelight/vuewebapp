#!/usr/bin/bash

npm audit --audit-level=moderate

if [ $? = 0 ]; then
    echo "Not found vulnerabilities more than moderate."
else
    echo `npm audit --audit-level=moderate | grep "found [0-9]* vulnerabilities"`
    exit 1
fi

npm run test:unit

if [ $? = 0 ]; then
    npm run build
else
    echo "npm run test:unit failed."
    exit 1
fi
