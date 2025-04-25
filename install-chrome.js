const puppeteer = require('puppeteer');

puppeteer
  .install()
  .then(() => {
    console.log('✅ Puppeteer Chrome installed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error installing Puppeteer Chrome:', err);
    process.exit(1);
  });
