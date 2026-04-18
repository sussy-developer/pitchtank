const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const colorMap = {
  // Backgrounds
  '#0B0F14': '#f9fafb',
  '#0a0b10': '#f9fafb',
  '#0d0e15': 'TOKEN_WHITE',
  '#111827': 'TOKEN_WHITE',
  '#12131a': '#f3f4f6',
  '#16171e': '#e5e7eb',
  '#1F2937': '#f3f4f6',
  '#1f2937': '#f3f4f6',
  '#2D3748': '#e5e7eb',
  '#374151': '#d1d5db',
  
  // Text colors
  '#9CA3AF': '#4b5563',
  '#9ca3af': '#4b5563',
  '#D1D5DB': '#374151',
  '#a1a1aa': '#52525b',

  // RGBAs for borders/overlays
  'rgba(255, 255, 255,': 'rgba(0, 0, 0,',
  'rgba(255,255,255,': 'rgba(0,0,0,',
  'rgba(10, 11, 16,': 'rgba(249, 250, 251,'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace whites with dark color for text/backgrounds globally FIRST
  content = content.replace(/#fff\b/gi, '#111827');
  content = content.replace(/#ffffff\b/gi, '#111827');
  content = content.replace(/color:\s*white\b/gi, 'color: #111827');

  // Replace colors from map
  for (const [dark, light] of Object.entries(colorMap)) {
    if (dark.startsWith('rgba')) {
      content = content.split(dark).join(light);
    } else {
      const regex = new RegExp(dark, 'gi');
      content = content.replace(regex, light);
    }
  }

  // Replace tokens
  content = content.replace(/TOKEN_WHITE/g, '#ffffff');

  // Fix button text colors back to white!
  content = content.replace(/(background:\s*(?:var\(--color-primary\)|#3B82F6|#ef4444|linear-gradient[^;]+);[\s\S]{0,100}?)color:\s*#111827/gi, '$1color: #ffffff');
  content = content.replace(/color:\s*#111827([\s\S]{0,100}?background:\s*(?:var\(--color-primary\)|#3B82F6|#ef4444|linear-gradient[^;]+))/gi, 'color: #ffffff$1');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.css') || fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

walkDir(srcDir);
