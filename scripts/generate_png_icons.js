import fs from 'node:fs';
import zlib from 'node:zlib';

function createSolidPng(width, height, r, g, b) {
  // Construct a minimal uncompressed or deflated truecolor PNG with an emerald/amber brand aesthetic
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(2, 9); // color type 2 (RGB)
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);

    // CRC32
    let crc = 0xffffffff;
    for (let i = 4; i < 8 + len; i++) {
      let c = (crc ^ buf[i]) & 0xff;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      crc = (crc >>> 8) ^ c;
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 3);
    scanlines[rowOffset] = 0; // Filter none
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      // Draw a subtle border and center symbol area
      const isEdge = x < 12 || x > width - 13 || y < 12 || y > height - 13;
      const isCenter = Math.abs(x - width / 2) < width * 0.25 && Math.abs(y - height / 2) < height * 0.25;
      
      if (isEdge) {
        scanlines[pxOffset] = 11;
        scanlines[pxOffset + 1] = 58;
        scanlines[pxOffset + 2] = 44;
      } else if (isCenter) {
        scanlines[pxOffset] = 217;
        scanlines[pxOffset + 1] = 119;
        scanlines[pxOffset + 2] = 6;
      } else {
        scanlines[pxOffset] = r;
        scanlines[pxOffset + 1] = g;
        scanlines[pxOffset + 2] = b;
      }
    }
  }

  const compressedData = zlib.deflateSync(scanlines);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const pwa192 = createSolidPng(192, 192, 15, 76, 58);
const pwa512 = createSolidPng(512, 512, 15, 76, 58);
const appleIcon = createSolidPng(180, 180, 15, 76, 58);

fs.writeFileSync('public/pwa-192x192.png', pwa192);
fs.writeFileSync('public/pwa-512x512.png', pwa512);
fs.writeFileSync('public/apple-touch-icon.png', appleIcon);
console.log('PNG icons created successfully');
