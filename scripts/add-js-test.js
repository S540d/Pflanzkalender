const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('Adding JavaScript test indicators...');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Add a test that runs IMMEDIATELY in the head
const headTest = `
  <script>
    // TEST 1: This runs in HEAD
    document.addEventListener('DOMContentLoaded', function() {
      var testDiv = document.createElement('div');
      testDiv.id = 'js-works';
      testDiv.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:green;color:white;padding:10px;text-align:center;z-index:999999999;font-size:20px;font-weight:bold;';
      testDiv.textContent = '✅ JAVASCRIPT FUNKTIONIERT!';
      document.body.appendChild(testDiv);
    });
  </script>
`;

// Insert right after <head>
html = html.replace('<head>', '<head>' + headTest);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ JavaScript test added!');
