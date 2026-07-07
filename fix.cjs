const fs = require('fs');
let content = fs.readFileSync('src/pages/AccountOpeningForm.jsx', 'utf8');

for (let i = 1; i <= 10; i++) {
  // Use regex to match motion.div with key={`step${i}`} and any initial/animate props
  const regex = new RegExp(`<motion\\.div key="step${i}"[^>]*>`, 'g');
  content = content.replace(regex, `<div className="animate-fade-in" key="step${i}">`);
}

// Now replace ONLY the closing motion.div tags that match the steps.
// Since we have a progress bar and select cards that use motion.div, we have to be careful.
// Wait, SelectCard uses <motion.div> too!
// If I replace all </motion.div>, I will break SelectCard!

// A safer way is just to replace the specific initial/animate props on the steps!
// Let's just remove initial, animate, exit from the step wrappers!
content = content.replace(/initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}/g, '');

fs.writeFileSync('src/pages/AccountOpeningForm.jsx', content);
console.log('Fixed opacity attributes.');
