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

// 1. Read source image
const srcPath = 'C:/Users/massa/.gemini/antigravity/brain/c04f892d-6894-422b-ae7c-4e696001f898/.user_uploaded/media_1789426273381.png';
const buf = fs.readFileSync(srcPath);

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

// 2. Alpha transparency processing (remove white background with soft anti-aliasing)
// Flood fill from corners or threshold based on brightness/saturation
// Any pixel that is near white (R>245, G>245, B>245) is transparent.
// Smooth falloff between 230 and 252 for anti-aliased edge.
for (let i = 0; i < raw.length; i += 4) {
  const r = raw[i];
  const g = raw[i + 1];
  const b = raw[i + 2];
  
  // Calculate lightness and saturation
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const isNeutralLight = min > 220 && (max - min) < 15;

  if (isNeutralLight) {
    if (min >= 250) {
      raw[i + 3] = 0; // completely transparent
    } else {
      // smooth alpha transition
      const alphaFactor = 1 - (min - 220) / 30;
      raw[i + 3] = Math.round(255 * Math.max(0, Math.min(1, alphaFactor)));
    }
  }
}

// 3. Encode new PNG with filter 0
const scanlines = Buffer.alloc(height * (1 + width * 4));
let scanOffset = 0;
let rawScanOffset = 0;

for (let y = 0; y < height; y++) {
  scanlines[scanOffset++] = 0; // Filter 0
  raw.copy(scanlines, scanOffset, rawScanOffset, rawScanOffset + width * 4);
  scanOffset += width * 4;
  rawScanOffset += width * 4;
}

const compressedIDAT = zlib.deflateSync(scanlines, { level: 9 });

const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(width, 0);
ihdrData.writeUInt32BE(height, 4);
ihdrData.writeUInt8(8, 8); // bit depth
ihdrData.writeUInt8(6, 9); // RGBA
ihdrData.writeUInt8(0, 10); // compression
ihdrData.writeUInt8(0, 11); // filter
ihdrData.writeUInt8(0, 12); // interlace

const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
const ihdrChunk = makeChunk('IHDR', ihdrData);
const idatChunk = makeChunk('IDAT', compressedIDAT);
const iendChunk = makeChunk('IEND', Buffer.alloc(0));

const outputPNG = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);

// Save outputs
const outDir = path.join(__dirname, '../public/brand');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'icon.png'), outputPNG);
fs.writeFileSync(path.join(outDir, 'icon-original.png'), buf);
fs.writeFileSync(path.join(__dirname, '../src/app/icon.png'), outputPNG);
fs.writeFileSync(path.join(__dirname, '../public/favicon.png'), outputPNG);

console.log('Successfully created transparent icon.png (' + outputPNG.length + ' bytes)!');
