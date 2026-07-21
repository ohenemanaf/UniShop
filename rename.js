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
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.md')) {
        results.push(file);
      }
    }
  });
  return results;
}

function processFile(filePath) {
  try {
    const originalCode = fs.readFileSync(filePath, 'utf8');
    
    // Replace UniShop variants with UniShop variants
    let newCode = originalCode
      .replace(/UniShop/g, 'UniShop')
      .replace(/UNISHOP/g, 'UNISHOP')
      .replace(/unishop/g, 'unishop');

    if (originalCode !== newCode) {
      fs.writeFileSync(filePath, newCode, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

const backendFiles = walk('./backend/src');
const frontendFiles = walk('./frontend/src');
const rootFiles = walk('./'); // get root markdown files like ROADMAP.md

[...backendFiles, ...frontendFiles, ...rootFiles].forEach(processFile);

console.log('Renaming Done!');
