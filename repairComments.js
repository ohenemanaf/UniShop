const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

function repairFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    // Replace the broken line comments with block comments
    // The broken comment is: //* followed by some lines, ending with \n \n
    const fixed = code.replace(/\/\/\*\n([\s\S]*?)\n \n/g, '/**\n$1\n */\n');
    
    if (code !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`Repaired: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error repairing ${filePath}:`, err.message);
  }
}

const backendFiles = walk('./backend/src');
const frontendFiles = walk('./frontend/src');

console.log(`Repairing ${backendFiles.length} backend files...`);
backendFiles.forEach(repairFile);

console.log(`Repairing ${frontendFiles.length} frontend files...`);
frontendFiles.forEach(repairFile);

console.log('Repair Done!');
