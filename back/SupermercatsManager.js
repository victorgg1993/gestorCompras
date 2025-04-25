const puppeteer = require('puppeteer');
const axios = require('axios');

class SupermercatManager {
  constructor(app) {}

  getProductInfo(supermercat, url) {
    switch (supermercat) {
      case 'mercadona':
        return this.getProductMercadona(url);

      case 'carrefour':
        return this.getProductCarrefour(url);
    }
  }

  getProductMercadona(url) {
    const regex = /<meta[^>]+content="([^"]+)"/g;

    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((res) => {
          const matches = [...res.data.matchAll(regex)].map((m) => m[1]);
          const jpgMatches = matches.filter((url) => url.includes('.jpg'));

          if (jpgMatches) {
            let _img = jpgMatches[0].replaceAll('=600', '=200');

            resolve({
              url: _img,
              product: url.split('/')[4]
            });
          }
          //
          else {
            reject('not-valid-url');
          }
        })
        .catch((err) => {
          reject('not-valid-url');
        });
    });
  }

  getProductCarrefour(url) {
    return new Promise((resolve, reject) => {
      // format "predecible"
      if (url.includes('www.carrefour.es')) {
        //
        if (url.includes('R-VC4AECOMM')) {
          let prodID = url.split('/');
          prodID = prodID[prodID.length - 2].split('-').at(-1);

          resolve({
            url: `https://static.carrefour.es/hd_510x_/img_pim_food/${prodID}_00_1.jpg`,
            product: prodID.padEnd(10, '0'),
            productID: prodID
          });
        }
        // format "no predecible"
        else {
          this.getProducteNoPredecibleCarrefour(url)
            .then((html) => {
              const match = html.match(/"sku"\s*:\s*"(\d+)"/);

              if (match) {
                let _sku = match[1].slice(0, -4);
                let prodID = url.split('/');
                prodID = prodID[prodID.length - 2].split('-').at(-1);

                resolve({
                  url: `https://static.carrefour.es/hd_510x_/img_pim_food/${_sku}_00_1.jpg`,
                  product: match[1],
                  productID: prodID
                });
              } else {
                console.log('SKU no encontrado: ', err);
                reject('non-processable');
              }
            })
            .catch((err) => {
              console.log('getProducteNoPredecibleCarrefour() error: ', err);
              reject('non-processable');
            });
        }
      }
      //
      else {
        reject('not-valid-url');
      }
    });
  }

  getProducteNoPredecibleCarrefour(url) {
    return new Promise((resolve, reject) => {
      puppeteer
        .launch({
          headless: true,
          executablePath:
            '/opt/render/project/.render/chrome/opt/google/chrome/chrome',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        .then((browser) => {
          return browser.newPage().then((page) => {
            return page
              .setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              )
              .then(() => {
                // Opciones para manejar las cookies y las cabeceras
                return page.setExtraHTTPHeaders({
                  'Accept-Language': 'en-US,en;q=0.9',
                  Connection: 'keep-alive',
                  'Accept-Encoding': 'gzip, deflate, br'
                });
              })
              .then(() => {
                return page.goto(url, { waitUntil: 'domcontentloaded' });
              })
              .then(() => {
                return page.content();
              })
              .then((html) => {
                browser.close();
                resolve(html); // Resolvemos la promesa con el código fuente de la página
              })
              .catch((error) => {
                browser.close();
                reject(JSON.stringify(error)); // Rechazamos la promesa si hay algún error
              });
          });
        })
        .catch(reject); // Rechazamos la promesa si hay algún error al lanzar el navegador
    });
  }
}

module.exports = SupermercatManager;
