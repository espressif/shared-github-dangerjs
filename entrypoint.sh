#!/bin/sh

set -euo pipefail

# Copy the whole dangerjs directory to the workspace directory
cp -r /src/* /github/workspace

# Remove any node_modules from the workspace to prevent fork-supplied
# packages from being resolved by Node.js module resolution
rm -rf /github/workspace/node_modules

# Change to the workspace directory
cd /github/workspace || exit

# Run DangerJS using absolute path to prevent CWD-based binary hijacking
/node_modules/.bin/danger ci --failOnErrors -v
