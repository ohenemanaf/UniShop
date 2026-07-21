const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

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

function processFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });

    let modified = false;

    // Add file header if not present
    if (!ast.comments || ast.comments.length === 0 || !ast.comments[0].value.includes('File:')) {
      const fileName = path.basename(filePath);
      const header = `*\n * File: ${fileName}\n * Description: Auto-generated documentation for ${fileName}\n * Date: ${new Date().toISOString().split('T')[0]}\n `;
      t.addComment(ast.program, 'leading', header, true);
      modified = true;
    }

    traverse(ast, {
      FunctionDeclaration(path) {
        if (!path.node.leadingComments) {
          const name = path.node.id ? path.node.id.name : 'Anonymous';
          const params = path.node.params.map(p => {
            if (p.type === 'Identifier') return p.name;
            if (p.type === 'ObjectPattern') return 'props';
            if (p.type === 'AssignmentPattern' && p.left.type === 'Identifier') return p.left.name;
            return 'param';
          });
          let comment = `*\n * Function ${name}\n`;
          params.forEach(p => {
            comment += ` * @param {any} ${p}\n`;
          });
          comment += ` * @returns {any}\n `;
          t.addComment(path.node, 'leading', comment, true);
          modified = true;
        }
      },
      ArrowFunctionExpression(path) {
        // Only comment if it's part of a variable declaration
        if (path.parent.type === 'VariableDeclarator' && !path.parentPath.parent.leadingComments) {
          const name = path.parent.id.name;
          const params = path.node.params.map(p => {
            if (p.type === 'Identifier') return p.name;
            if (p.type === 'ObjectPattern') return 'props';
            if (p.type === 'AssignmentPattern' && p.left.type === 'Identifier') return p.left.name;
            return 'param';
          });
          let comment = `*\n * Arrow Function ${name}\n`;
          params.forEach(p => {
            comment += ` * @param {any} ${p}\n`;
          });
          comment += ` * @returns {any}\n `;
          t.addComment(path.parentPath.parent, 'leading', comment, true);
          modified = true;
        }
      }
    });

    if (modified) {
      const output = generate(ast, {}, code);
      fs.writeFileSync(filePath, output.code, 'utf8');
      console.log(`Commented: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

const backendFiles = walk('./backend/src');
const frontendFiles = walk('./frontend/src');

console.log(`Processing ${backendFiles.length} backend files...`);
backendFiles.forEach(processFile);

console.log(`Processing ${frontendFiles.length} frontend files...`);
frontendFiles.forEach(processFile);

console.log('Done!');
