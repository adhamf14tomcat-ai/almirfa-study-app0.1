import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(2, 9); // color type 2 (Truecolor RGB)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with filter byte (0) per row
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowSize);
  
  // Center anchor shape or circle
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.38;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep nautical background #14213d, anchor shape/circle in off-white #f4f1de
      let pr = 20;
      let pg = 33;
      let pb = 61;

      // Outer ring
      if (Math.abs(dist - radius) < width * 0.035) {
        pr = 244; pg = 241; pb = 222;
      }
      // Center anchor vertical line
      else if (Math.abs(dx) < width * 0.035 && y > height * 0.25 && y < height * 0.75) {
        pr = 244; pg = 241; pb = 222;
      }
      // Crossbar
      else if (Math.abs(dy + height * 0.15) < height * 0.035 && Math.abs(dx) < width * 0.25) {
        pr = 244; pg = 241; pb = 222;
      }
      // Fluke arc
      else if (y > cy && Math.abs(dist - radius * 0.8) < width * 0.045 && dy > 0) {
        pr = 244; pg = 241; pb = 222;
      }
      // Top loop
      else if (Math.abs(Math.sqrt(dx * dx + (y - (cy - height * 0.28)) ** 2) - width * 0.08) < width * 0.03) {
        pr = 244; pg = 241; pb = 222;
      }

      rawData[pxOffset] = pr;
      rawData[pxOffset + 1] = pg;
      rawData[pxOffset + 2] = pb;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);

  const crc = Buffer.alloc(4);
  crc.writeInt32BE(calculateCRC(body), 0);

  return Buffer.concat([len, body, crc]);
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function calculateCRC(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) | 0;
}

fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180));
console.log('PNG icons created successfully!');
