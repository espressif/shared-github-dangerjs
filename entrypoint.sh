#!/bin/sh

set -euo pipefail

# Copy the whole dangerjs directory to the workspace directory
cp -r /src/* /github/workspace

# Change to the workspace directory
cd /github/workspace || exit

echo "Custom input: ${CUSTOM}"

env

# Run DangerJS
npx danger ci --failOnErrors -v
