function obtenerCodigoFuente(url) {
    return new Promise((resolve, reject) => {
      puppeteer.launch({
        headless: true, // No usar headless, pero puedes dejarlo como `true` si prefieres
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      .then(browser => {
        return browser.newPage().then(page => {
          // Establece un user-agent para parecer un navegador real
          return page.setUserAgent(
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
          .then(html => {
            browser.close();
            resolve(html); // Resolvemos la promesa con el código fuente de la página
          })
          .catch(error => {
            browser.close();
            reject(error); // Rechazamos la promesa si hay algún error
          });
        });
      })
      .catch(reject); // Rechazamos la promesa si hay algún error al lanzar el navegador
    });
  }
  

// Usar la función
obtenerCodigoFuente(
  'https://www.carrefour.es/supermercado/galletas-de-chocolate-rellenas-de-crema-oreo-154-g/R-526510911/p'
).then((html) => {
  console.log(html); // Aquí tendrás el código fuente de la página
});
