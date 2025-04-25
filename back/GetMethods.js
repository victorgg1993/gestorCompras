const DatabaseManager = require('./DatabaseManager');
const HTTPSManager = require('./HTTPSManager');
const Common = require('./Common');

class GetMethods {
  fs = require('fs');
  path = require('path');
  Debugger = require('./Debugger');

  app;
  dbJson;
  dbProductes;
  RUTA_DB = '../db/db.json';

  constructor(app) {
    this.app = app;
    this.debug = new this.Debugger();
    this.ruta = this.path.resolve(__dirname, this.RUTA_DB);
    this.https = new HTTPSManager();
    this.common = new Common();
    // this.dbJson = DatabaseManager.readJson(this.ruta);
  }

  home(req, res, dirname) {
    // this.debug.log(this.debug.TYPE.INFO, 'GetMethods.js', 'home()', 'get /');
    res.sendFile(this.path.resolve(__dirname, '..', 'public', 'index.html'));
  }

  categories(req, res, dirname) {
    this.dbJson = DatabaseManager.readJson(this.ruta);

    // this.debug.log(
    //   this.debug.TYPE.INFO,
    //   'GetMethods.js',
    //   'categories()',
    //   'get /categories'
    // );
    res.json(this.dbJson);
  }

  categoryTitles(req, res, dirname) {
    let ret = [];
    this.dbJson = DatabaseManager.readJson(this.ruta);

    for (const categoria of this.dbJson.categories) {
      ret.push(categoria.title);
    }

    res.json(ret);
  }

  compresManuals(req, res, dirname) {
    this.dbJson = DatabaseManager.readJson(this.ruta);
    // this.debug.log(
    //   this.debug.TYPE.INFO,
    //   'GetMethods.js',
    //   'compresManuals()',
    //   'get /compres-automatiques'
    // );
    res.json(this.dbJson.compresManuals);
  }

  sessio(req, res, dirname) {
    this.dbJson = DatabaseManager.readJson(this.ruta);
    let _numCompresDone = DatabaseManager.readJson(this.ruta).compresDone.length;
    // this.debug.log(
    //   this.debug.TYPE.INFO,
    //   'GetMethods.js',
    //   'sessio()',
    //   'get /sessio'
    // );

    res.json({...this.dbJson.sessio, numCompresDone: _numCompresDone});
  }

  existeix(req, res, dirname) {
    let _id = req.query.id;
    let supermercat = req.query.supermercat;
    this.dbJson = DatabaseManager.readJson(this.ruta);

    let _resp = this.common.productExists(this.dbJson, _id, supermercat); // <--------- to-do: revisar

    console.log('supermercat: ', supermercat);

    if (_resp.exists == false) {
      this.https
        .get(`https://tienda.mercadona.es/api/v1_1/products/${_id}`)
        .then((_data) => {
          let data = JSON.parse(_data);
          const regex = /\/images\/([^\/]+)\.jpg/;

          console.log('existeix -> img: ', data.photos[0].zoom.match(regex)[1]);

          if (data != '') {
            data = {
              id: data.id,
              unitats: 1,
              diesCompra: Array(24).fill(false),
              image: `https://prod-mercadona.imgix.net/images/${
                data.photos[0].zoom.match(regex)[1]
              }.jpg?fit=crop&h=600&w=600`,
              tags: [data.id],
              titol: data.display_name
            };
          }

          res.json({ error: false, existeix: _resp.exists, data });
        })
        .catch((err) => {
          res.json({ error: true, data: err });
        });
    } else {
      res.json({ error: false, existeix: true });
    }
  }

  /**
   * GET un a compra de l'històric.
   * to-do: No està bé encara, ja que el compres done de la db
   * conté varios elements amb el mateix número, així que mai pots
   * anar més enrrera d'un any
   */
  compra(req, res, dirname) {
    let retorno = { error: true, data: 'El número de setmana no existeix' };
    this.dbJson = DatabaseManager.readJson(this.ruta).compresDone;

    for (const compra of this.dbJson) {
      if (compra.nSetmana == req.query.compra) {
        retorno.error = false;
        retorno.data = { compra: compra, numCompres: this.dbJson.length };
        break;
      }
    }

    res.json(retorno);
  }
}

module.exports = GetMethods;
