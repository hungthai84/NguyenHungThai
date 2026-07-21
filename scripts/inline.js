import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const assetsDir = path.join(distDir, 'assets');

// 1. Read dist/index.html
const indexPath = path.join(distDir, 'index.html');
let htmlContent = fs.readFileSync(indexPath, 'utf8');

// 2. Find the js file in dist/assets
const files = fs.readdirSync(assetsDir);
const jsFile = files.find(file => file.endsWith('.js'));

if (!jsFile) {
  console.error('No JS bundle file found in dist/assets!');
  process.exit(1);
}

console.log(`Found JS bundle: ${jsFile}`);

// 3. Read JS bundle content
const jsPath = path.join(assetsDir, jsFile);
let jsContent = fs.readFileSync(jsPath, 'utf8');

// Escape code to make sure it doesn't break script tags inside string literals (e.g. </script> -> <\/script>)
// (Vite already handles this for JS literals, but let's be safe)

// 4. Replace script tag in HTML content
// The tag looks like: <script type="module" crossorigin src="/assets/index-GbBBtvav.js"></script>
const scriptTagRegex = /<script\s+type="module"\s+crossorigin\s+src="\/assets\/index-[a-zA-Z0-9_-]+\.js"\s*><\/script>/;

if (!scriptTagRegex.test(htmlContent)) {
  console.warn('Could not match standard script tag regex, trying fallback match...');
}

// Replace the tag
htmlContent = htmlContent.replace(
  scriptTagRegex,
  `<script type="module">${jsContent}</script>`
);

// Fallback replacement if regex failed to match exact tag structure
if (htmlContent.includes('/assets/index-')) {
  // Let's replace any script referencing assets/index-*.js
  const fallbackRegex = /<script[^>]*src="\/assets\/index-[^"]+\.js"[^>]*><\/script>/g;
  htmlContent = htmlContent.replace(fallbackRegex, `<script type="module">${jsContent}</script>`);
}

// 5. Save the single file as my-resume-complete.html in the root
const outputPath = path.join(process.cwd(), 'my-resume-complete.html');
fs.writeFileSync(outputPath, htmlContent, 'utf8');

console.log(`Successfully generated self-contained HTML file: ${outputPath}`);
