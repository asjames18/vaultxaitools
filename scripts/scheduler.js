const cron = require('node-cron');
const { runCombinedAutomation } = require('./combined-automation');

// Schedule the automation to run daily at 6 AM
const schedule = '0 6 * * *'; // Every day at 6:00 AM

console.log('⏰ Setting up AI Tools Automation Scheduler...');
console.log(`📅 Schedule: ${schedule} (Daily at 6:00 AM)`);

// Start the cron job
cron.schedule(schedule, async () => {
  console.log('🚀 Running scheduled Combined AI Automation...');
  console.log(`📅 ${new Date().toISOString()}`);
  
  try {
    await runCombinedAutomation();
    console.log('✅ Scheduled combined automation completed successfully!');
  } catch (error) {
    console.error('❌ Scheduled combined automation failed:', error);
  }
}, {
  scheduled: true,
  timezone: 'UTC'
});

console.log('✅ Scheduler started successfully!');
console.log('🔄 Automation will run daily at 6:00 AM UTC');

// Keep the process running
process.on('SIGINT', () => {
  console.log('🛑 Stopping scheduler...');
  process.exit(0);
});

module.exports = { schedule }; 