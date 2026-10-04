import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

// Keep every reference selector confined to internal pages. The only document
// rule adjusts rem sizing while an internal page is actually present.
function scope(css) {
  // Repair two malformed declarations present in the published source.
  const root = postcss.parse(css.replaceAll('!important:', '!important;').replaceAll('cubic-bezier(.2, 0, .2, 1;', 'cubic-bezier(.2, 0, .2, 1);'));
  root.walkRules(rule => {
    if (rule.parent?.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return;
    rule.selectors = rule.selectors.map(selector => {
      const mapped = selector
        .replace(/^html\b/, 'html:has(.reference-page)')
        .replace(/^body\b/, '.reference-page')
        .replace(/^:root\b/, '.reference-page');
      return /^(html:has\(\.reference-page\)|\.reference-page)(?=[\s.#:[>+~]|$)/.test(mapped)
        ? mapped : `.reference-page ${mapped}`;
    });
  });
  return root.toString();
}

const input = path.resolve('src/content/reference');
const output = path.resolve('public/reference/styles');
fs.mkdirSync(output, { recursive: true });
for (const file of fs.readdirSync(input).filter(name => name.endsWith('.css'))) {
  fs.writeFileSync(path.join(output, file), scope(fs.readFileSync(path.join(input, file), 'utf8')));
}
const manifest = JSON.parse(fs.readFileSync(path.join(input, 'manifest.json'), 'utf8'));
fs.writeFileSync('src/config/search-index.json', JSON.stringify(Object.entries(manifest).map(([href, page]) => ({ href, title: page.heading, description: page.description })), null, 2));
console.log(`Scoped reference styles and indexed ${Object.keys(manifest).length} pages.`);
