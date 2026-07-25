import fs from 'fs';
import path from 'path';
import https from 'https';

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Placeholder images
  const images = [
    { url: 'https://placehold.co/400x400/png?text=Logo', name: 'logo.png' },
    { url: 'https://placehold.co/400x400/png?text=Person', name: 'placeholder-person.png' },
    { url: 'https://placehold.co/800x800/png?text=Not+Available', name: 'not-available-image.png' }
  ];

  for (const img of images) {
    const dest = path.join(publicDir, img.name);
    console.log(`Downloading ${img.name}...`);
    await download(img.url, dest);
  }
  
  console.log('Done!');
}

main().catch(console.error);
