#!/usr/bin/env node

/**
 * Simple Accessibility Test Script
 * This script checks for common accessibility issues in our components
 */

const fs = require('fs');
const path = require('path');

// Common accessibility patterns to check for
const accessibilityPatterns = {
  // ARIA attributes
  ariaLabel: /aria-label=/g,
  ariaLabelledby: /aria-labelledby=/g,
  ariaDescribedby: /aria-describedby=/g,
  ariaExpanded: /aria-expanded=/g,
  ariaControls: /aria-controls=/g,
  ariaModal: /aria-modal=/g,
  ariaLive: /aria-live=/g,
  ariaAtomic: /aria-atomic=/g,
  ariaHidden: /aria-hidden=/g,
  ariaChecked: /aria-checked=/g,
  ariaValuenow: /aria-valuenow=/g,
  ariaValuemin: /aria-valuemin=/g,
  ariaValuemax: /aria-valuemax=/g,
  ariaValuetext: /aria-valuetext=/g,
  
  // Semantic HTML
  button: /<button/g,
  label: /<label/g,
  fieldset: /<fieldset/g,
  legend: /<legend/g,
  nav: /<nav/g,
  main: /<main/g,
  section: /<section/g,
  article: /<article/g,
  aside: /<aside/g,
  header: /<header/g,
  footer: /<footer/g,
  
  // Focus management
  focusVisible: /focus-visible/g,
  focusRing: /focus:ring/g,
  focusOutline: /focus:outline/g,
  tabIndex: /tabindex=/g,
  
  // Screen reader support
  srOnly: /sr-only/g,
  skipLink: /skip-link/g,
  
  // Form accessibility
  htmlFor: /htmlFor=/g,
  id: /id=/g,
  required: /required/g,
  disabled: /disabled/g,
  
  // Role attributes
  role: /role=/g,
  roleButton: /role="button"/g,
  roleDialog: /role="dialog"/g,
  roleNavigation: /role="navigation"/g,
  roleMain: /role="main"/g,
  roleRegion: /role="region"/g,
  roleRadiogroup: /role="radiogroup"/g,
  roleRadio: /role="radio"/g,
  roleMenubar: /role="menubar"/g,
  roleMenuitem: /role="menuitem"/g,
  roleAlert: /role="alert"/g,
  roleStatus: /role="status"/g,
  
  // Keyboard navigation
  onKeyDown: /onKeyDown/g,
  onKeyUp: /onKeyUp/g,
  onKeyPress: /onKeyPress/g,
  
  // Alt text for images
  alt: /alt=/g,
  
  // Skip links
  skipToContent: /skip.*content/i,
  mainContent: /main.*content/i,
};

// Components to test
const componentsToTest = [
  'src/components/AccessibleModal.tsx',
  'src/components/AccessibleRating.tsx',
  'src/components/SearchAndFilter.tsx',
  'src/components/AuthModal.tsx',
  'src/components/ReviewForm.tsx',
  'src/components/Navigation.tsx',
  'src/components/SearchResults.tsx',
  'src/app/layout.tsx',
  'src/app/globals.css',
];

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const results = {};
    
    for (const [patternName, pattern] of Object.entries(accessibilityPatterns)) {
      const matches = content.match(pattern);
      results[patternName] = matches ? matches.length : 0;
    }
    
    return results;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

function generateReport() {
  console.log('🔍 Accessibility Test Report\n');
  console.log('=' .repeat(50));
  
  let totalIssues = 0;
  let totalPatterns = 0;
  
  for (const filePath of componentsToTest) {
    console.log(`\n📁 Testing: ${filePath}`);
    console.log('-'.repeat(30));
    
    const results = checkFile(filePath);
    if (!results) {
      console.log('❌ Could not read file');
      continue;
    }
    
    let fileIssues = 0;
    let filePatterns = 0;
    
    for (const [patternName, count] of Object.entries(results)) {
      if (count > 0) {
        console.log(`✅ ${patternName}: ${count} instances`);
        filePatterns += count;
      }
    }
    
    // Check for missing critical patterns
    const criticalPatterns = ['ariaLabel', 'focusVisible', 'role', 'htmlFor'];
    const missingCritical = criticalPatterns.filter(pattern => results[pattern] === 0);
    
    if (missingCritical.length > 0) {
      console.log(`⚠️  Missing critical patterns: ${missingCritical.join(', ')}`);
      fileIssues += missingCritical.length;
    }
    
    totalIssues += fileIssues;
    totalPatterns += filePatterns;
    
    if (fileIssues === 0) {
      console.log('✅ File passes accessibility checks');
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`Total accessibility patterns found: ${totalPatterns}`);
  console.log(`Total issues identified: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('🎉 All components pass basic accessibility checks!');
  } else {
    console.log('⚠️  Some accessibility improvements needed');
  }
  
  console.log('\n🔧 Recommendations:');
  console.log('1. Test with screen readers (NVDA, JAWS, VoiceOver)');
  console.log('2. Test keyboard navigation (Tab, Shift+Tab, Arrow keys)');
  console.log('3. Test with high contrast mode');
  console.log('4. Test with reduced motion preferences');
  console.log('5. Run automated tools like axe-core or Lighthouse');
  console.log('6. Test with actual users with disabilities');
}

// Run the test
generateReport(); 