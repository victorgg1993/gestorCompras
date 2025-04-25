const https = require('https');

class HTTPSManager {
  constructor() {
    //
  }

  get(url) {
    return new Promise((resolve, reject) => {
      https
        .get(url, (response) => {
          let data = '';

          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            resolve(data);
          });
        })
        .on('error', (error) => {
          reject(error.message);
        });
    });
  }
}

module.exports = HTTPSManager;
