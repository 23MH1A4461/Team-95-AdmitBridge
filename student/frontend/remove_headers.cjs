const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Use regex to match the entire page-header div
  // It handles nested divs by finding the start and matching up to the last </div> before the next main section.
  // Actually, a simple regex might be fragile if there are other nested divs.
  // We know the structure is:
  // <div className="page-header">
  //   <div className="page-header-icon" ...>...</div>
  //   <div className="page-header-text">...</div>
  // </div>
  // Or for CollegeSuggestions: it has some imports.
  // Let's use a simpler regex that matches from `<div className="page-header">` to the matching `</div>`.
  
  const regex = /<div className="page-header">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  
  // Wait, let's just do it precisely
  content = content.replace(/<div className="page-header">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
  
  // A safer approach:
  const headerStart = content.indexOf('<div className="page-header">');
  if (headerStart !== -1) {
    // Find the end of this div. It has 2 nested divs. So we need to count open/close tags.
    let depth = 0;
    let headerEnd = -1;
    for (let i = headerStart; i < content.length; i++) {
      if (content.substr(i, 4) === '<div') depth++;
      else if (content.substr(i, 5) === '</div') {
        depth--;
        if (depth === 0) {
          headerEnd = i + 6;
          break;
        }
      }
    }
    if (headerEnd !== -1) {
      content = content.substring(0, headerStart) + content.substring(headerEnd);
    }
  }

  fs.writeFileSync(filePath, content);
});

console.log("Headers removed.");
