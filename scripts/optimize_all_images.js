const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Disable internal sharp file cache so Windows doesn't lock files
sharp.cache(false);

const TARGET_DIRS = [
  'public/phots_for_gallery',
  'phots_for_gallery',
  'public/places_images',
  'places_imags',
  'public/about_page',
  'about_page',
  'public/our-story',
  'public',
  'assets/team_memebers',
  'assets/nepal_natureimages',
  'assets',
];

function getResizeOptions(filepath, meta) {
  const lower = filepath.toLowerCase().replace(/\\/g, '/');
  
  // Avatars / team members
  if (lower.includes('team_memebers') || lower.includes('team_members')) {
    return { maxWidth: 800, maxHeight: 1000, quality: 85 };
  }
  
  // Hero banners and wide panoramas
  if (lower.includes('main_page') || lower.includes('hero') || lower.includes('mountains')) {
    return { maxWidth: 1920, maxHeight: 1200, quality: 84 };
  }
  
  // Maps
  if (lower.includes('map')) {
    return { maxWidth: 1600, maxHeight: 1200, quality: 86 };
  }
  
  // Daily Sadhana
  if (lower.includes('sadhna')) {
    return { maxWidth: 1200, maxHeight: 1600, quality: 84 };
  }
  
  // Gallery and places images (photo journal, timeline, experiences)
  return { maxWidth: 1600, maxHeight: 1600, quality: 82 };
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
    return null;
  }
  
  if (path.basename(filePath).startsWith('favicon')) return null;

  const inputBuffer = fs.readFileSync(filePath);
  const sizeBefore = inputBuffer.length;

  let meta;
  try {
    meta = await sharp(inputBuffer).metadata();
  } catch (e) {
    console.warn(`Could not read metadata for ${filePath}: ${e.message}`);
    return null;
  }

  const { maxWidth, maxHeight, quality } = getResizeOptions(filePath, meta);
  
  const needsResize = meta.width > maxWidth || meta.height > maxHeight;
  
  // If image is already smaller than 120KB and within dimensions, skip recompressing
  if (!needsResize && sizeBefore < 120 * 1024 && ext === '.webp') {
    return null;
  }

  let pipeline = sharp(inputBuffer);
  if (needsResize) {
    pipeline = pipeline.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  let optimizedBuffer;
  if (ext === '.jpg' || ext === '.jpeg') {
    optimizedBuffer = await pipeline
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer();
  } else if (ext === '.png') {
    optimizedBuffer = await pipeline
      .png({ compressionLevel: 9, palette: meta.hasAlpha ? false : true, quality })
      .toBuffer();
  } else if (ext === '.webp') {
    optimizedBuffer = await pipeline
      .webp({ quality, effort: 5 })
      .toBuffer();
  } else if (ext === '.avif') {
    optimizedBuffer = await pipeline
      .avif({ quality, effort: 4 })
      .toBuffer();
  }

  if (optimizedBuffer && optimizedBuffer.length < sizeBefore) {
    fs.writeFileSync(filePath, optimizedBuffer);
  }

  // Also create/update .webp sibling if not webp
  let webpPath = null;
  let webpSize = null;
  if (ext !== '.webp') {
    webpPath = filePath.replace(/\.(jpe?g|png|avif)$/i, '.webp');
    let webpPipe = sharp(inputBuffer);
    if (needsResize) {
      webpPipe = webpPipe.resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true });
    }
    const webpBuffer = await webpPipe
      .webp({ quality, effort: 5 })
      .toBuffer();
    fs.writeFileSync(webpPath, webpBuffer);
    webpSize = webpBuffer.length;
  }

  const sizeAfter = fs.statSync(filePath).size;

  return {
    filePath,
    widthBefore: meta.width,
    heightBefore: meta.height,
    sizeBeforeKB: (sizeBefore / 1024).toFixed(1),
    sizeAfterKB: (sizeAfter / 1024).toFixed(1),
    savingsPercent: (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(1),
    webpPath,
    webpSizeKB: webpSize ? (webpSize / 1024).toFixed(1) : null,
  };
}

async function run() {
  console.log('Starting comprehensive image optimization with in-memory buffers...\n');
  const processed = new Set();
  let totalSavedBytes = 0;
  let totalBeforeBytes = 0;
  let totalAfterBytes = 0;
  let count = 0;

  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) continue;
      const fullPath = path.join(dir, entry.name);
      const normalized = path.resolve(fullPath);
      if (processed.has(normalized)) continue;
      processed.add(normalized);

      try {
        const res = await optimizeImage(fullPath);
        if (res) {
          count++;
          const beforeBytes = parseFloat(res.sizeBeforeKB) * 1024;
          const afterBytes = parseFloat(res.sizeAfterKB) * 1024;
          totalBeforeBytes += beforeBytes;
          totalAfterBytes += afterBytes;
          totalSavedBytes += (beforeBytes - afterBytes);

          console.log(`[${count}] ${res.filePath}`);
          console.log(`    Before: ${res.widthBefore}x${res.heightBefore} (${res.sizeBeforeKB} KB)`);
          console.log(`    After:  ${res.sizeAfterKB} KB (-${res.savingsPercent}%)`);
          if (res.webpSizeKB) {
            console.log(`    WebP:   ${res.webpSizeKB} KB created at ${res.webpPath}`);
          }
        }
      } catch (err) {
        console.error(`Error optimizing ${fullPath}:`, err.message);
      }
    }
  }

  console.log('\n=======================================');
  console.log(`Optimization Complete!`);
  console.log(`Total images processed: ${count}`);
  console.log(`Original size: ${(totalBeforeBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized size: ${(totalAfterBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total space saved: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB (${((totalSavedBytes / totalBeforeBytes) * 100).toFixed(1)}% reduction!)`);
  console.log('=======================================\n');
}

run();
