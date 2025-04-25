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
          this.getProducteFotutCarrefour(url)
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
                console.log('SKU no encontrado');
                console.log('2 error: ', err);
                reject('non-processable');
              }
            })
            .catch((err) => {
              console.log('1 error: ', err);
              reject('non-processable');
            });
        }
      }
      //
      else {
        reject('not-valid-url');
      }

      // ----------------------- Formato predecible
      // nesquik
      // URL: https://www.carrefour.es/supermercado/cacao-soluble-instantaneo-nestle-nesquik-sin-gluten-390-g/R-VC4AECOMM-580913/p
      // POST: https://www.carrefour.es/cloud-api/one-cart-api/v1/carts/current/items/5809130000?quantity=1&site=food&added_from=product&product_id=VC4AECOMM-580913
      // img: https://static.carrefour.es/hd_510x_/img_pim_food/580913_00_1.jpg

      // ----------------------- Formato no predecible ( no tenen VC4AECOMM )
      // crema de verduras:
      // URL: https://www.carrefour.es/supermercado/crema-de-verduras-mediterraneas-classic-carrefour-sin-gluten-500-ml/R-prod1130075/p
      // POST: https://www.carrefour.es/cloud-api/one-cart-api/v1/carts/current/items/1777380000?quantity=1&site=food&added_from=product&product_id=prod1130075
      // img: https://static.carrefour.es/hd_510x_/img_pim_food/177738_00_1.jpg

      // oreo
      // URL: https://www.carrefour.es/supermercado/galletas-de-chocolate-rellenas-de-crema-oreo-154-g/R-526510911/p
      // POST: https://www.carrefour.es/cloud-api/one-cart-api/v1/carts/current/items/2557050000?quantity=1&site=food&added_from=product&product_id=526510911
      // img: https://static.carrefour.es/hd_510x_/img_pim_food/255705_00_1.jpg
    });
  }

  getProducteFotutCarrefour(url) {
    console.log('ch1');
    return new Promise((resolve, reject) => {
      puppeteer
        .launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        .then((browser) => {
          console.log('ch2');

          return browser.newPage().then((page) => {
            console.log('ch3');

            // Establece un user-agent para parecer un navegador real
            return page
              .setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              )
              .then(() => {
                console.log('ch4');

                // Opciones para manejar las cookies y las cabeceras
                return page.setExtraHTTPHeaders({
                  'Accept-Language': 'en-US,en;q=0.9',
                  Connection: 'keep-alive',
                  'Accept-Encoding': 'gzip, deflate, br'
                });
              })
              .then(() => {
                console.log('ch5');
                return page.goto(url, { waitUntil: 'domcontentloaded' });
              })
              .then(() => {
                console.log('ch6');
                return page.content();
              })
              .then((html) => {
                browser.close();
                resolve(html); // Resolvemos la promesa con el código fuente de la página
              })
              .catch((error) => {
                browser.close();
                reject(error); // Rechazamos la promesa si hay algún error
              });
          });
        })
        .catch(reject); // Rechazamos la promesa si hay algún error al lanzar el navegador
    });
  }
}

module.exports = SupermercatManager;
