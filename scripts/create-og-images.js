const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Convert SVG to optimized JPG
const convertSvgToJpg = async (svgContent, outputPath, quality = 85) => {
  try {
    const buffer = Buffer.from(svgContent);
    await sharp(buffer)
      .resize(1200, 630, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .jpeg({ quality, progressive: true, mozjpeg: true })
      .toFile(outputPath);
    
    // Get file size
    const stats = fs.statSync(outputPath);
    const fileSizeInKB = Math.round(stats.size / 1024);
    
    console.log(`✅ Created ${path.basename(outputPath)} (${fileSizeInKB}KB)`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${path.basename(outputPath)}:`, error.message);
    return false;
  }
};

// Create a simple SVG-based OG image for the homepage
const createOGImage = async () => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Decorative elements -->
  <circle cx="100" cy="100" r="50" fill="url(#accent)" opacity="0.3"/>
  <circle cx="1100" cy="530" r="80" fill="url(#accent)" opacity="0.2"/>
  <circle cx="200" cy="500" r="30" fill="url(#accent)" opacity="0.4"/>
  
  <!-- Main content area -->
  <rect x="100" y="150" width="1000" height="330" rx="20" fill="rgba(255,255,255,0.95)"/>
  
  <!-- Logo/Icon -->
  <g transform="translate(150, 200)">
    <rect x="0" y="0" width="80" height="80" rx="20" fill="url(#accent)"/>
    <text x="40" y="50" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">VX</text>
  </g>
  
  <!-- Main title -->
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#1f2937">VaultX AI Tools</text>
  
  <!-- Subtitle -->
  <text x="600" y="320" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#6b7280">Expert-Curated AI Tool Directory</text>
  
  <!-- Tagline -->
  <text x="600" y="360" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#9ca3af">Quality over quantity - every tool verified</text>
  
  <!-- CTA -->
  <rect x="450" y="400" width="300" height="50" rx="25" fill="url(#accent)"/>
  <text x="600" y="430" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white">Discover AI Tools</text>
  
  <!-- Bottom accent -->
  <rect x="0" y="580" width="1200" height="50" fill="url(#accent)"/>
</svg>`;

  const jpgPath = path.join(publicDir, 'og-image.jpg');
  const svgPath = path.join(publicDir, 'og-image.svg');
  
  // Save SVG version
  fs.writeFileSync(svgPath, svg);
  console.log('✅ Created og-image.svg');
  
  // Convert to JPG
  return await convertSvgToJpg(svg, jpgPath);
};

// Create blog-specific OG image
const createBlogOGImage = async () => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Decorative elements -->
  <circle cx="100" cy="100" r="50" fill="url(#accent)" opacity="0.3"/>
  <circle cx="1100" cy="530" r="80" fill="url(#accent)" opacity="0.2"/>
  
  <!-- Main content area -->
  <rect x="100" y="150" width="1000" height="330" rx="20" fill="rgba(255,255,255,0.95)"/>
  
  <!-- Blog icon -->
  <g transform="translate(150, 200)">
    <rect x="0" y="0" width="80" height="80" rx="20" fill="url(#accent)"/>
    <text x="40" y="50" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">📝</text>
  </g>
  
  <!-- Main title -->
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#1f2937">AI Tools Blog</text>
  
  <!-- Subtitle -->
  <text x="600" y="320" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#6b7280">Latest Insights &amp; Reviews</text>
  
  <!-- Tagline -->
  <text x="600" y="360" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#9ca3af">Expert analysis and industry updates</text>
  
  <!-- CTA -->
  <rect x="450" y="400" width="300" height="50" rx="25" fill="url(#accent)"/>
  <text x="600" y="430" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white">Read Articles</text>
  
  <!-- Bottom accent -->
  <rect x="0" y="580" width="1200" height="50" fill="url(#accent)"/>
</svg>`;

  const jpgPath = path.join(publicDir, 'og-blog.jpg');
  const svgPath = path.join(publicDir, 'og-blog.svg');
  
  // Save SVG version
  fs.writeFileSync(svgPath, svg);
  console.log('✅ Created og-blog.svg');
  
  // Convert to JPG
  return await convertSvgToJpg(svg, jpgPath);
};

// Create category-specific OG image
const createCategoryOGImage = async () => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Decorative elements -->
  <circle cx="100" cy="100" r="50" fill="url(#accent)" opacity="0.3"/>
  <circle cx="1100" cy="530" r="80" fill="url(#accent)" opacity="0.2"/>
  
  <!-- Main content area -->
  <rect x="100" y="150" width="1000" height="330" rx="20" fill="rgba(255,255,255,0.95)"/>
  
  <!-- Category icon -->
  <g transform="translate(150, 200)">
    <rect x="0" y="0" width="80" height="80" rx="20" fill="url(#accent)"/>
    <text x="40" y="50" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">📂</text>
  </g>
  
  <!-- Main title -->
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#1f2937">AI Tool Categories</text>
  
  <!-- Subtitle -->
  <text x="600" y="320" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#6b7280">Organized by Function &amp; Industry</text>
  
  <!-- Tagline -->
  <text x="600" y="360" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#9ca3af">Find the perfect AI solution for your needs</text>
  
  <!-- CTA -->
  <rect x="450" y="400" width="300" height="50" rx="25" fill="url(#accent)"/>
  <text x="600" y="430" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white">Browse Categories</text>
  
  <!-- Bottom accent -->
  <rect x="0" y="580" width="1200" height="50" fill="url(#accent)"/>
</svg>`;

  const jpgPath = path.join(publicDir, 'og-category.jpg');
  const svgPath = path.join(publicDir, 'og-category.svg');
  
  // Save SVG version
  fs.writeFileSync(svgPath, svg);
  console.log('✅ Created og-category.svg');
  
  // Convert to JPG
  return await convertSvgToJpg(svg, jpgPath);
};

// Main execution
const main = async () => {
  console.log('🚀 Creating OG Images for VaultX AI Tools...\n');

  try {
    const results = await Promise.all([
      createOGImage(),
      createBlogOGImage(),
      createCategoryOGImage()
    ]);
    
    const successCount = results.filter(Boolean).length;
    
    console.log(`\n✅ ${successCount}/3 OG images created successfully!`);
    
    if (successCount === 3) {
      console.log('\n🎉 All OG images are ready for production!');
      console.log('\n📝 Next steps:');
      console.log('1. ✅ JPG images created and optimized');
      console.log('2. 🔄 Update meta tags to use JPG versions');
      console.log('3. 🧪 Test social media sharing previews');
      console.log('4. 📊 Monitor social media engagement');
    } else {
      console.log('\n⚠️  Some images failed to create. Check the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Error creating OG images:', error);
    process.exit(1);
  }
};

main();
