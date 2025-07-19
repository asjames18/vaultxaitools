#!/usr/bin/env node

/**
 * Smoke Test Script
 * This script performs basic smoke tests to ensure the application is working
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running Smoke Tests...\n');

let allTestsPassed = true;

// Test 1: Check if build directory exists
function testBuildDirectory() {
  console.log('📁 Test 1: Checking build directory...');
  try {
    const buildPath = path.join(process.cwd(), '.next');
    if (fs.existsSync(buildPath)) {
      console.log('✅ Build directory exists');
      return true;
    } else {
      console.log('❌ Build directory not found');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking build directory:', error.message);
    return false;
  }
}

// Test 2: Check if package.json exists and has required scripts
function testPackageJson() {
  console.log('\n📦 Test 2: Checking package.json...');
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packagePath)) {
      console.log('❌ package.json not found');
      return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredScripts = ['dev', 'build', 'start', 'lint'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

    if (missingScripts.length === 0) {
      console.log('✅ All required scripts found');
      return true;
    } else {
      console.log(`❌ Missing scripts: ${missingScripts.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking package.json:', error.message);
    return false;
  }
}

// Test 3: Check if TypeScript config exists
function testTypeScriptConfig() {
  console.log('\n🔧 Test 3: Checking TypeScript configuration...');
  try {
    const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
    if (fs.existsSync(tsConfigPath)) {
      console.log('✅ TypeScript config found');
      return true;
    } else {
      console.log('❌ TypeScript config not found');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking TypeScript config:', error.message);
    return false;
  }
}

// Test 4: Check if Next.js config exists
function testNextConfig() {
  console.log('\n⚙️  Test 4: Checking Next.js configuration...');
  try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    const nextConfigJsPath = path.join(process.cwd(), 'next.config.js');
    
    if (fs.existsSync(nextConfigPath) || fs.existsSync(nextConfigJsPath)) {
      console.log('✅ Next.js config found');
      return true;
    } else {
      console.log('❌ Next.js config not found');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking Next.js config:', error.message);
    return false;
  }
}

// Test 5: Check if environment variables are set
function testEnvironmentVariables() {
  console.log('\n🔐 Test 5: Checking environment variables...');
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envExamplePath = path.join(process.cwd(), 'env.example');
    
    if (fs.existsSync(envPath)) {
      console.log('✅ .env.local found');
      return true;
    } else if (fs.existsSync(envExamplePath)) {
      console.log('⚠️  .env.local not found, but env.example exists');
      return true;
    } else {
      console.log('❌ No environment configuration found');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking environment variables:', error.message);
    return false;
  }
}

// Test 6: Check if source files exist
function testSourceFiles() {
  console.log('\n📂 Test 6: Checking source files...');
  try {
    const srcPath = path.join(process.cwd(), 'src');
    const appPath = path.join(srcPath, 'app');
    const componentsPath = path.join(srcPath, 'components');
    
    const requiredPaths = [srcPath, appPath, componentsPath];
    const missingPaths = requiredPaths.filter(path => !fs.existsSync(path));

    if (missingPaths.length === 0) {
      console.log('✅ All required source directories found');
      return true;
    } else {
      console.log(`❌ Missing directories: ${missingPaths.map(p => path.basename(p)).join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking source files:', error.message);
    return false;
  }
}

// Test 7: Check if dependencies are installed
function testDependencies() {
  console.log('\n📚 Test 7: Checking dependencies...');
  try {
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    const packageLockPath = path.join(process.cwd(), 'package-lock.json');
    
    if (fs.existsSync(nodeModulesPath) && fs.existsSync(packageLockPath)) {
      console.log('✅ Dependencies installed');
      return true;
    } else {
      console.log('❌ Dependencies not installed');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking dependencies:', error.message);
    return false;
  }
}

// Test 8: Check if the application can be built (if not already built)
function testBuildProcess() {
  console.log('\n🔨 Test 8: Testing build process...');
  try {
    const buildPath = path.join(process.cwd(), '.next');
    
    if (!fs.existsSync(buildPath)) {
      console.log('Building application...');
      execSync('npm run build', { stdio: 'pipe' });
      console.log('✅ Build successful');
    } else {
      console.log('✅ Build already exists');
    }
    return true;
  } catch (error) {
    console.log('❌ Build failed:', error.message);
    return false;
  }
}

// Run all tests
const tests = [
  testPackageJson,
  testTypeScriptConfig,
  testNextConfig,
  testEnvironmentVariables,
  testSourceFiles,
  testDependencies,
  testBuildProcess,
  testBuildDirectory,
];

tests.forEach(test => {
  const result = test();
  if (!result) {
    allTestsPassed = false;
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Smoke Test Summary');
console.log('='.repeat(50));

if (allTestsPassed) {
  console.log('🎉 All smoke tests passed!');
  console.log('✅ Application is ready for deployment');
  process.exit(0);
} else {
  console.log('❌ Some smoke tests failed');
  console.log('⚠️  Please fix the issues before deployment');
  process.exit(1);
} 