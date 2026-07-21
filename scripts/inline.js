import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const assetsDir = path.join(distDir, 'assets');

// 1. Read dist/index.html
const indexPath = path.join(distDir, 'index.html');
let htmlContent = fs.readFileSync(indexPath, 'utf8');

// 2. Find and inline CSS files
const files = fs.readdirSync(assetsDir);
const cssFiles = files.filter(file => file.endsWith('.css'));

if (cssFiles.length > 0) {
  cssFiles.forEach(cssFile => {
    console.log(`Found CSS bundle to inline: ${cssFile}`);
    const cssPath = path.join(assetsDir, cssFile);
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Regex to match: <link rel="stylesheet" crossorigin href="/assets/index-XXXX.css">
    const cssTagRegex = new RegExp(`<link\\s+rel="stylesheet"\\s+crossorigin\\s+href="\\/assets\\/${cssFile.replace('.', '\\.')}"\\s*\\/?>`);
    
    if (cssTagRegex.test(htmlContent)) {
      htmlContent = htmlContent.replace(cssTagRegex, `<style>${cssContent}</style>`);
      console.log(`Successfully inlined CSS: ${cssFile}`);
    } else {
      // Fallback matching if exact structure differs
      const fallbackCssRegex = /<link[^>]*href="\/assets\/[^"]+\.css"[^>]*>/g;
      htmlContent = htmlContent.replace(fallbackCssRegex, `<style>${cssContent}</style>`);
      console.log(`Fallback inlined CSS: ${cssFile}`);
    }
  });
} else {
  console.log('No CSS bundle file found in dist/assets to inline.');
}

// 3. Find and inline JS files
const jsFiles = files.filter(file => file.endsWith('.js'));
const jsFile = jsFiles.find(file => file.includes('index'));

if (!jsFile) {
  console.error('No main JS bundle file found in dist/assets!');
  process.exit(1);
}

console.log(`Found JS bundle to inline: ${jsFile}`);
const jsPath = path.join(assetsDir, jsFile);
const jsContent = fs.readFileSync(jsPath, 'utf8');

// Regex to match: <script type="module" crossorigin src="/assets/index-XXXX.js"></script>
const scriptTagRegex = new RegExp(`<script\\s+type="module"\\s+crossorigin\\s+src="\\/assets\\/${jsFile.replace('.', '\\.')}"\\s*><\\/script>`);

if (scriptTagRegex.test(htmlContent)) {
  htmlContent = htmlContent.replace(scriptTagRegex, `<script type="module">${jsContent}</script>`);
  console.log(`Successfully inlined JS: ${jsFile}`);
} else {
  // Fallback replacement if exact regex failed
  const fallbackJsRegex = /<script[^>]*src="\/assets\/index-[^"]+\.js"[^>]*><\/script>/g;
  htmlContent = htmlContent.replace(fallbackJsRegex, `<script type="module">${jsContent}</script>`);
  console.log(`Fallback inlined JS: ${jsFile}`);
}

// 4. Save the single file as my-resume-complete.html in the root
const outputPath = path.join(process.cwd(), 'my-resume-complete.html');
fs.writeFileSync(outputPath, htmlContent, 'utf8');

console.log(`Successfully generated self-contained HTML file: ${outputPath}`);
