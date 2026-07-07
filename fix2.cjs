const fs = require('fs');
let content = fs.readFileSync('src/pages/AccountOpeningForm.jsx', 'utf8');

for (let i = 1; i <= 10; i++) {
  // Replace the closing tag for each step
  // Since we replaced the opening tag to <div className="animate-fade-in" key="stepX">
  // We need to replace the corresponding </motion.div> to </div>
  // The easiest way is to match the switch cases block.
}

// Actually, let's just do a blanket replacement for the specific block.
// We know all the steps have `</motion.div>` right before `);`
content = content.replace(/<\/motion\.div>\s*\n\s*\);/g, '</div>\n        );');

fs.writeFileSync('src/pages/AccountOpeningForm.jsx', content);
console.log('Fixed closing div tags.');
