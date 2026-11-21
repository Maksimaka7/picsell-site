// Runs after `hugo` (see netlify.toml). English pages live under Hugo's default
// language, so relLangURL and every hard-coded "/demo/" on them resolve to the
// Ukrainian page. A script in <head> used to patch the links in the browser,
// which left the raw HTML — what search and AI crawlers read — pointing English
// pages at Ukrainian ones, and sent visitors to 404s where no English page
// exists. This rewrites internal links in public/en/**/*.html at build time,
// and only when the English target really exists.
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || 'public';
const enRoot = path.join(root, 'en');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
const hasEn = (p) => fs.existsSync(path.join(enRoot, p, 'index.html'));

let files = 0;
let links = 0;
if (fs.existsSync(enRoot)) {
  for (const file of walk(enRoot)) {
    if (!file.endsWith('.html')) continue;
    const html = fs.readFileSync(file, 'utf8');
    // href may be quoted or, after minification, bare: href=/radar/
    const out = html.replace(/(<a\b[^>]*?\shref=)(["']?)(\/[^"'\s>]*)/g, (m, pre, q, url) => {
      if (url.startsWith('/en/') || url === '/en' || url.startsWith('//')) return m;
      const [, p, rest] = url.match(/^([^?#]*)(.*)$/);
      if (!p.endsWith('/') || !hasEn(p)) return m; // a file, or no English version
      links += 1;
      return `${pre}${q}/en${p}${rest}`;
    });
    if (out !== html) {
      fs.writeFileSync(file, out);
      files += 1;
    }
  }
}
console.log(`fix-en-links: ${links} links in ${files} English pages now point to /en/`);
