const sharp = require('sharp');
const path = require('path');

async function trimLogo() {
  const inputPath = path.join(__dirname, '..', 'public', 'cleclo.png');
  const tempPath = path.join(__dirname, '..', 'public', 'cleclo-trimmed.png');

  console.log('Trimming transparent padding from:', inputPath);

  // Auto trim transparent or white margins
  await sharp(inputPath)
    .trim()
    .toFile(tempPath);

  const meta = await sharp(tempPath).metadata();
  console.log('New trimmed dimensions:', meta.width, 'x', meta.height);

  const fs = require('fs');
  fs.copyFileSync(tempPath, inputPath);
  fs.unlinkSync(tempPath);

  console.log('Successfully replaced public/cleclo.png with trimmed version!');
}

trimLogo().catch(err => {
  console.error('Error trimming logo:', err);
});
