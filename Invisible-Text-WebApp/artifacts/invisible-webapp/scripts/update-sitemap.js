import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

async function updateSitemap() {
  try {
    const file = resolve(process.cwd(), 'public', 'sitemap.xml');
    const data = await readFile(file, 'utf8');
    const today = new Date().toISOString().slice(0, 10);
    const updated = data.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
    await writeFile(file, updated, 'utf8');
    console.log(`sitemap.xml updated with <lastmod>${today}</lastmod>`);
  } catch (err) {
    console.error('Failed to update sitemap:', err);
    process.exit(1);
  }
}

updateSitemap();
