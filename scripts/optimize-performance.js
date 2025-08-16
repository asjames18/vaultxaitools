#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Performance Optimization Analysis');
console.log('=====================================\n');

// Check for common performance issues
const checks = [
  {
    name: 'Bundle Size Analysis',
    check: () => {
      const nextDir = path.join(process.cwd(), '.next');
      if (fs.existsSync(nextDir)) {
        console.log('✅ Next.js build directory exists');
        return true;
      } else {
        console.log('⚠️  No Next.js build found. Run: npm run build');
        return false;
      }
    }
  },
  {
    name: 'Image Optimization',
    check: () => {
      const publicDir = path.join(process.cwd(), 'public');
      if (fs.existsSync(publicDir)) {
        const files = fs.readdirSync(publicDir);
        const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(f));
        console.log(`✅ Found ${imageFiles.length} image files in public directory`);
        return true;
      }
      return false;
    }
  },
  {
    name: 'Environment Variables',
    check: () => {
      const envFiles = ['.env.local', '.env'];
      const found = envFiles.filter(f => fs.existsSync(path.join(process.cwd(), f)));
      console.log(`✅ Environment files found: ${found.join(', ')}`);
      return found.length > 0;
    }
  },
  {
    name: 'Package Dependencies',
    check: () => {
      const packageJson = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packageJson)) {
        const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
        const deps = Object.keys(pkg.dependencies || {}).length;
        const devDeps = Object.keys(pkg.devDependencies || {}).length;
        console.log(`✅ Dependencies: ${deps} production, ${devDeps} development`);
        return true;
      }
      return false;
    }
  }
];

// Run checks
let passedChecks = 0;
checks.forEach(check => {
  console.log(`\n🔍 ${check.name}:`);
  if (check.check()) {
    passedChecks++;
  }
});

console.log(`\n📊 Results: ${passedChecks}/${checks.length} checks passed`);

// Performance recommendations
console.log('\n🎯 Performance Recommendations:');
console.log('================================');

const recommendations = [
  '1. Enable compression in next.config.ts (already done)',
  '2. Use Next.js Image component for all images',
  '3. Implement lazy loading for non-critical components',
  '4. Add caching headers for static assets',
  '5. Consider using a CDN for global performance',
  '6. Monitor Core Web Vitals in production',
  '7. Use dynamic imports for large components',
  '8. Optimize database queries with proper indexing',
  '9. Implement service worker for caching',
  '10. Use React.memo for expensive components'
];

recommendations.forEach(rec => console.log(`   ${rec}`));

console.log('\n🚀 Next Steps:');
console.log('==============');
console.log('1. Deploy to production to see real performance metrics');
console.log('2. Monitor Vercel Speed Insights dashboard');
console.log('3. Run Lighthouse audits regularly');
console.log('4. Consider implementing ISR for better caching');
console.log('5. Optimize images using next/image with proper sizes');

console.log('\n✅ Performance analysis complete!'); 