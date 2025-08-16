#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { runAutomation: runToolsAutomation } = require('./ai-tools-automation');
const { runNewsAutomation } = require('./ai-news-automation');
const fs = require('fs').promises;
const path = require('path');

async function runCombinedAutomation() {
  console.log('🚀 Starting Combined AI Automation...');
  console.log(`📅 ${new Date().toISOString()}`);
  console.log('=' .repeat(60));
  
  const startTime = Date.now();
  const results = {
    timestamp: new Date().toISOString(),
    tools: { success: false, count: 0, errors: [] },
    news: { success: false, count: 0, errors: [] },
    duration: 0
  };
  
  try {
    // Run AI Tools Automation
    console.log('\n🛠️  Running AI Tools Automation...');
    try {
      await runToolsAutomation();
      results.tools.success = true;
      results.tools.count = 'completed';
      console.log('✅ AI Tools automation completed successfully!');
    } catch (error) {
      results.tools.errors.push(error.message);
      console.error('❌ AI Tools automation failed:', error.message);
    }
    
    // Run AI News Automation
    console.log('\n📰 Running AI News Automation...');
    try {
      await runNewsAutomation();
      results.news.success = true;
      results.news.count = 'completed';
      console.log('✅ AI News automation completed successfully!');
    } catch (error) {
      results.news.errors.push(error.message);
      console.error('❌ AI News automation failed:', error.message);
    }
    
    // Calculate duration
    results.duration = Date.now() - startTime;
    
    // Generate combined report
    await generateCombinedReport(results);
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Combined automation completed!');
    console.log(`⏱️  Total duration: ${Math.round(results.duration / 1000)}s`);
    console.log(`🛠️  Tools: ${results.tools.success ? '✅' : '❌'}`);
    console.log(`📰 News: ${results.news.success ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('💥 Combined automation failed:', error);
    throw error;
  }
}

async function generateCombinedReport(results) {
  const reportPath = path.join(__dirname, '../logs/combined-automation-report.json');
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  
  console.log('📋 Combined report generated:', reportPath);
  return results;
}

// CLI interface
if (require.main === module) {
  runCombinedAutomation()
    .then(() => {
      console.log('\n🎉 Combined automation script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Combined automation script failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runCombinedAutomation,
  generateCombinedReport
}; 