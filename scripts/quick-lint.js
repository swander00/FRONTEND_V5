#!/usr/bin/env node

/**
 * Quick Lint Script
 * 
 * Runs a fast lint check focusing on critical errors only.
 * This is useful for quick validation before committing or deploying.
 * 
 * Usage: node scripts/quick-lint.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Running quick lint check...\n');

try {
  // Run ESLint with max warnings to fail on errors only
  execSync('npx next lint --dir . --max-warnings 1000', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  console.log('\n✅ Quick lint check passed!');
  console.log('💡 Note: Some warnings may exist, but no critical errors found.\n');
} catch (error) {
  console.error('\n❌ Critical errors found! Please fix them before proceeding.\n');
  console.error('Common issues to check:');
  console.error('  • React Hooks called conditionally (must be called at top level)');
  console.error('  • Missing closing brackets or parentheses');
  console.error('  • Unescaped characters in JSX (apostrophes, quotes)');
  console.error('  • Import/export syntax errors\n');
  process.exit(1);
}

