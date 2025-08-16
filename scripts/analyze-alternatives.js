const fs = require('fs');

// Read the tools data
const toolsData = JSON.parse(fs.readFileSync('data/tools.json', 'utf8'));

console.log('🔍 Analyzing alternatives data...\n');

let issues = 0;
let totalAlternatives = 0;
let toolsWithIssues = [];

toolsData.forEach(tool => {
  if (tool.alternatives && Array.isArray(tool.alternatives)) {
    totalAlternatives += tool.alternatives.length;
    
    // Check for self-references
    const selfReferences = tool.alternatives.filter(alt => 
      alt.name.toLowerCase() === tool.name.toLowerCase()
    );
    
    // Check for duplicates
    const names = tool.alternatives.map(alt => alt.name.toLowerCase());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    
    if (selfReferences.length > 0 || duplicates.length > 0) {
      toolsWithIssues.push({
        name: tool.name,
        category: tool.category,
        selfReferences: selfReferences.map(alt => alt.name),
        duplicates: duplicates
      });
      
      console.log(`❌ ${tool.name} (${tool.category}):`);
      if (selfReferences.length > 0) {
        console.log(`   Self-references: ${selfReferences.map(alt => alt.name).join(', ')}`);
        issues++;
      }
      if (duplicates.length > 0) {
        console.log(`   Duplicates: ${duplicates.join(', ')}`);
        issues++;
      }
    }
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Total tools with alternatives: ${toolsData.filter(t => t.alternatives && t.alternatives.length > 0).length}`);
console.log(`   Total alternatives: ${totalAlternatives}`);
console.log(`   Issues found: ${issues}`);
console.log(`   Tools with issues: ${toolsWithIssues.length}`);

if (toolsWithIssues.length > 0) {
  console.log(`\n🔧 Tools that need fixing:`);
  toolsWithIssues.forEach(tool => {
    console.log(`   - ${tool.name} (${tool.category})`);
  });
}

console.log(`\n💡 Next: We'll fix these issues and improve the alternatives data.`);
