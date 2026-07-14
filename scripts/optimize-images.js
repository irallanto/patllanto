const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const OUTPUT_SUFFIX = '-opt.webp';

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full);
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
        convert(full);
      }
    }
  }
}

async function convert(file) {
  try {
    const dir = path.dirname(file);
    const base = path.basename(file, path.extname(file));
    const out = path.join(dir, base + OUTPUT_SUFFIX);
    if (fs.existsSync(out)) {
      console.log('Skipping (exists):', out);
      return;
    }

    await sharp(file)
      .webp({ quality: 80 })
      .toFile(out);

    console.log('Created:', out);
  } catch (err) {
    console.error('Error converting', file, err.message);
  }
}

if (!fs.existsSync(ASSETS_DIR)) {
  console.error('Assets directory not found:', ASSETS_DIR);
  process.exit(1);
}

console.log('Scanning assets for images...');
walk(ASSETS_DIR);
console.log('Done.');
