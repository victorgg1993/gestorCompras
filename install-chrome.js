const puppeteer = require('puppeteer');

(async () => {
  try {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const localRevisions = await browserFetcher.localRevisions();

    if (!localRevisions.length) {
      console.log("📦 Installing Chromium...");
      await browserFetcher.download(puppeteer._preferredRevision);
      console.log("✅ Chromium installed.");
    } else {
      console.log("✅ Chromium already installed.");
    }
  } catch (err) {
    console.error("❌ Failed to install Chromium:", err);
    process.exit(1);
  }
})();
