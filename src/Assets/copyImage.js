const fs = require('fs');
const path = require('path');

const srcPath = 'C:/Users/Kisses/.gemini/antigravity-ide/brain/24c36f13-abfd-44e7-bb57-06c745ef731b/media__1787063337188.png';
const destAssetsLogo = path.join(__dirname, 'logo.png');
const destPublicLogo = path.join(__dirname, '../../public/logo.png');

try {
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destAssetsLogo);
    fs.copyFileSync(srcPath, destPublicLogo);
    console.log('Logo image successfully updated!');
  } else {
    console.error('Source image does not exist:', srcPath);
  }
} catch (err) {
  console.error('Error updating logo image:', err);
}
