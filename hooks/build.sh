#!/bin/bash

# Force npm usage and disable lockfiles
export NPM_CONFIG_PACKAGE_LOCK=false
export NPM_CONFIG_LOCKFILE=false
export NPM_CONFIG_FUND=false
export NPM_CONFIG_AUDIT=false

# Remove any existing lockfiles
rm -f package-lock.json
rm -f bun.lockb
rm -f yarn.lock

# Install with npm (no lockfile)
npm install --no-package-lock --no-audit --no-fund

echo "✅ Build hook completed - using npm without lockfiles"
