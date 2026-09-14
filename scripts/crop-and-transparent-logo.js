const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.slice(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function encodePNG(width, height, rawRGBA) {
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  let scanOffset = 0;
  let rawScanOffset = 0;

  for (let y = 0; y < height; y++) {
    scanlines[scanOffset++] = 0; // Filter 0
    rawRGBA.copy(scanlines, scanOffset, rawScanOffset, rawScanOffset + width * 4);
    scanOffset += width * 4;
    rawScanOffset += width * 4;
  }

  const compressedIDAT = zlib.deflateSync(scanlines, { level: 9 });

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);

  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressedIDAT);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
}

function decodePNG(buf) {
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);

  let pos = 8;
  const idatBuffers = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.slice(pos + 4, pos + 8).toString('ascii');
    if (type === 'IDAT') idatBuffers.push(buf.slice(pos + 8, pos + 8 + len));
    pos += 12 + len;
  }

  const decompressed = zlib.inflateSync(Buffer.concat(idatBuffers));
  const bpp = 4;
  const stride = width * bpp;
  const raw = Buffer.alloc(width * height * 4);

  function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }

  let srcOffset = 0;
  let dstOffset = 0;

  for (let y = 0; y < height; y++) {
    const filter = decompressed[srcOffset++];
    for (let x = 0; x < stride; x++) {
      const rawVal = decompressed[srcOffset++];
      const left = x >= bpp ? raw[dstOffset - bpp] : 0;
      const up = y > 0 ? raw[dstOffset - stride] : 0;
      const upLeft = (y > 0 && x >= bpp) ? raw[dstOffset - stride - bpp] : 0;
      let val = 0;
      if (filter === 0) val = rawVal;
      else if (filter === 1) val = (rawVal + left) & 0xff;
      else if (filter === 2) val = (rawVal + up) & 0xff;
      else if (filter === 3) val = (rawVal + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) val = (rawVal + paeth(left, up, upLeft)) & 0xff;
      raw[dstOffset++] = val;
    }
  }

  return { width, height, raw };
}

// 1. Read source full logo image
const srcPath = 'C:/Users/massa/.gemini/antigravity/brain/c04f892d-6894-422b-ae7c-4e696001f898/.user_uploaded/media_1789427179129.png';
const srcBuf = fs.readFileSync(srcPath);
const { width, height, raw } = decodePNG(srcBuf);

// Bounding box: minX: 50, minY: 162, maxX: 944, maxY: 582
const pad = 12;
const cropX = Math.max(0, 50 - pad);
const cropY = Math.max(0, 162 - pad);
const cropW = Math.min(width - cropX, (944 - 50) + pad * 2);
const cropH = Math.min(height - cropY, (582 - 162) + pad * 2);

console.log('Cropping region:', { cropX, cropY, cropW, cropH });

const croppedRaw = Buffer.alloc(cropW * cropH * 4);
const croppedDarkRaw = Buffer.alloc(cropW * cropH * 4);

for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((cropY + y) * width + (cropX + x)) * 4;
    const dstIdx = (y * cropW + x) * 4;

    const r = raw[srcIdx];
    const g = raw[srcIdx + 1];
    const b = raw[srcIdx + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const isNeutralLight = min > 220 && (max - min) < 15;

    let a = 255;
    if (isNeutralLight) {
      if (min >= 248) {
        a = 0;
      } else {
        const factor = 1 - (min - 220) / 28;
        a = Math.round(255 * Math.max(0, Math.min(1, factor)));
      }
    }

    croppedRaw[dstIdx] = r;
    croppedRaw[dstIdx + 1] = g;
    croppedRaw[dstIdx + 2] = b;
    croppedRaw[dstIdx + 3] = a;

    // Dark background version:
    // If it's the dark gunmetal text/facets, boost brightness slightly for contrast on dark backgrounds
    croppedDarkRaw[dstIdx] = r;
    croppedDarkRaw[dstIdx + 1] = g;
    croppedDarkRaw[dstIdx + 2] = b;
    croppedDarkRaw[dstIdx + 3] = a;
  }
}

const outDir = path.join(__dirname, '../public/brand');
fs.mkdirSync(outDir, { recursive: true });

// Encode cropped transparent logo for light backgrounds
const logoPNG = encodePNG(cropW, cropH, croppedRaw);
fs.writeFileSync(path.join(outDir, 'logo.png'), logoPNG);
fs.writeFileSync(path.join(outDir, 'logo-full.png'), logoPNG);
console.log('Saved logo.png:', logoPNG.length, 'bytes');

// Encode cropped transparent logo for dark backgrounds
for (let i = 0; i < croppedDarkRaw.length; i += 4) {
  const r = croppedDarkRaw[i];
  const g = croppedDarkRaw[i + 1];
  const b = croppedDarkRaw[i + 2];
  const a = croppedDarkRaw[i + 3];

  if (a > 15) {
    // Copper/bronze has significantly higher red than blue: r - b > 25
    const isCopper = (r - b) > 25 && r > 90;
    if (!isCopper) {
      // It's gunmetal/graphite text or arrow -> map to bright silver/white
      const lum = (r * 0.299 + g * 0.587 + b * 0.114);
      const bright = Math.min(255, Math.round(210 + lum * 0.45));
      croppedDarkRaw[i] = bright;
      croppedDarkRaw[i + 1] = Math.min(255, bright + 3);
      croppedDarkRaw[i + 2] = Math.min(255, bright + 6);
    }
  }
}
const logoDarkPNG = encodePNG(cropW, cropH, croppedDarkRaw);
fs.writeFileSync(path.join(outDir, 'logo-dark.png'), logoDarkPNG);
console.log('Saved logo-dark.png:', logoDarkPNG.length, 'bytes');

// Now crop just the icon for favicon / standalone icon
const iconCropW = Math.min(cropW, 420);
const iconCropH = cropH;
const iconRaw = Buffer.alloc(iconCropW * iconCropH * 4);
for (let y = 0; y < iconCropH; y++) {
  for (let x = 0; x < iconCropW; x++) {
    const srcIdx = (y * cropW + x) * 4;
    const dstIdx = (y * iconCropW + x) * 4;
    iconRaw[dstIdx] = croppedRaw[srcIdx];
    iconRaw[dstIdx + 1] = croppedRaw[srcIdx + 1];
    iconRaw[dstIdx + 2] = croppedRaw[srcIdx + 2];
    iconRaw[dstIdx + 3] = croppedRaw[srcIdx + 3];
  }
}
const iconPNG = encodePNG(iconCropW, iconCropH, iconRaw);
fs.writeFileSync(path.join(outDir, 'icon.png'), iconPNG);
fs.writeFileSync(path.join(__dirname, '../src/app/icon.png'), iconPNG);
fs.writeFileSync(path.join(__dirname, '../public/favicon.png'), iconPNG);
console.log('Saved icon.png:', iconPNG.length, 'bytes');
