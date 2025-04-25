const DatabaseManager = require('./DatabaseManager');
const Common = require('./Common');

class PutMethods {
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
    this.common = new Common();

    this.dbJson = {}; //DatabaseManager.readJson(this.ruta);
  }

  producte(req, res, dirname) {
    // s'ha de mirar la categoria rebuda
    // si el producte hi és, s'ha de moure a la nova categoria
    let _error = true;
    let msg = '';
    this.dbJson = DatabaseManager.readJson(this.ruta);
    const keyLeida = Object.keys(req.body.producte)[0];

    let _resp = this.common.productExists(
      this.dbJson,
      req.body.producte[keyLeida].id,
      keyLeida
    ); // referència: primer supermercat

    if (!_resp.exists) {
      if (req.body.categoria == '') {
        _resp._error = true;
        _resp.msg = 'Categoria no vàlida';
      }
      // Add product
      else {
        _resp = this.common.addProduct(this.dbJson, req.body);
        _error = _resp.error;
        msg = _resp.msg;
      }
    }
    // Edit product
    else {
      _error = false;
      msg = 'Producte actualitzat';
      // esborrar el producte

      this.dbJson = this.common.removeProduct(
        this.dbJson,
        req.body.producte[keyLeida].id,
        keyLeida
      ).data;

      // tornar-lo a afegir ( així si es mou de categoria, s'actualitza bé)
      _resp = this.common.addProduct(this.dbJson, req.body);
      _error = _resp.error;
      msg = _resp.msg;
    }

    if (_error == false) {
      // console.log('json a guardar: ', JSON.stringify(this.dbJson, null, 2));
      DatabaseManager.writeJson(this.dbJson, this.ruta);
    }
    //
    else {
      console.log(
        'hi ha agut un error en el PutMethods.js -> producte(): ',
        _resp
      );
    }

    res.json({ error: _error, data: msg });
  }
}

module.exports = PutMethods;
