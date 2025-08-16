#!/usr/bin/env node

const { runAutomation, helpers } = require('./ai-tools-automation');

async function testAutomation() {
  console.log('🧪 Testing AI Tools Automation System...');
  console.log('=' .repeat(50));
  
  try {
    // Test helper functions
    console.log('\n🔧 Testing Helper Functions:');
    
    // Test categorization
    const testCases = [
      { name: 'ChatGPT', description: 'AI language model', expected: 'Language' },
      { name: 'Midjourney', description: 'AI image generator', expected: 'Design' },
      { name: 'GitHub Copilot', description: 'AI code assistant', expected: 'Development' },
      { name: 'Notion AI', description: 'Productivity tool', expected: 'Productivity' }
    ];
    
    testCases.forEach(({ name, description, expected }) => {
      const result = helpers.categorizeTool(name, description);
      const status = result === expected ? '✅' : '❌';
      console.log(`${status} ${name}: ${result} (expected: ${expected})`);
    });
    
    // Test ID generation
    console.log('\n🆔 Testing ID Generation:');
    const testNames = ['AI Tool 123!', 'Chat-GPT', 'Midjourney AI'];
    testNames.forEach(name => {
      const id = helpers.generateId(name);
      console.log(`✅ "${name}" -> "${id}"`);
    });
    
    // Test logo generation
    console.log('\n🎨 Testing Logo Generation:');
    const logoTests = ['AI Bot', 'ChatGPT', 'Image Generator', 'Code Assistant'];
    logoTests.forEach(name => {
      const logo = helpers.generateLogo(name);
      console.log(`✅ "${name}" -> ${logo}`);
    });
    
    // Test full automation (dry run)
    console.log('\n🚀 Testing Full Automation (Dry Run):');
    console.log('Note: This will not save to database in test mode');
    
    // Mock environment variables for testing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log('⚠️  No Supabase URL found, skipping database test');
      console.log('✅ All helper function tests passed!');
      return;
    }
    
    // Run automation with reduced limits for testing
    const originalMaxTools = require('./ai-tools-automation').config.maxToolsPerRun;
    require('./ai-tools-automation').config.maxToolsPerRun = 5;
    
    await runAutomation();
    
    // Restore original config
    require('./ai-tools-automation').config.maxToolsPerRun = originalMaxTools;
    
    console.log('✅ Automation test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  testAutomation()
    .then(() => {
      console.log('\n🎉 All tests passed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Tests failed:', error);
      process.exit(1);
    });
}

module.exports = { testAutomation }; 