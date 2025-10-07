#!/usr/bin/env node

/**
 * Build Debugging Script
 * 
 * This script helps identify syntax errors and other issues
 * that might cause build failures before deploying.
 * 
 * Usage: node scripts/debug-build.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Starting build diagnostics...\n');

// Step 1: Check for syntax errors with ESLint
console.log('📋 Step 1: Running ESLint to check for syntax errors...');
try {
  execSync('npx next lint --dir .', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  console.log('✅ ESLint check passed!\n');
} catch (error) {
  console.error('❌ ESLint found errors. Please fix them before building.\n');
  process.exit(1);
}

// Step 2: Check TypeScript types
console.log('📋 Step 2: Checking TypeScript types...');
try {
  execSync('npx tsc --noEmit', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  console.log('✅ TypeScript check passed!\n');
} catch (error) {
  console.error('❌ TypeScript found type errors. Please fix them before building.\n');
  process.exit(1);
}

// Step 3: Run a test build
console.log('📋 Step 3: Running test build...');
try {
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  console.log('✅ Build succeeded!\n');
} catch (error) {
  console.error('❌ Build failed. Check the error messages above.\n');
  process.exit(1);
}

console.log('🎉 All checks passed! Your app is ready to deploy.');

