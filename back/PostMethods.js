const DatabaseManager = require('./DatabaseManager');

class PostMethods {
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

    this.dbJson = {}; //DatabaseManager.readJson(this.ruta);
  }

  // to-do: implementar
  compra(req, res, dirname) {
    this.dbJson = DatabaseManager.readJson(this.ruta);

    let _novaDate = new Date().getTime();
    let nCompra = req.body.nCompra;
    let productes_a_guardar = [];

    for (const producte of req.body.compra) {
      productes_a_guardar.push({
        id: producte.producte[req.body.supermercat].id,
        unitats: producte.producte[req.body.supermercat].unitats
      });
    }

    this.dbJson.compresDone.push({
      date: _novaDate,
      nSetmana: nCompra,
      supermercat: req.body.supermercat,
      productes: [...productes_a_guardar]
    });

    ++nCompra; // el server incrementa la pròxima compra i no pas el front

    if (nCompra == 24) {
      nCompra = 0;
    }

    this.dbJson.sessio.numSetmana = nCompra;
    this.dbJson.sessio.dateUltimaCompra = _novaDate;
    this.dbJson.compresManuals = [];

    DatabaseManager.writeJson(this.dbJson, this.ruta); // abans d'activar això, acaba la lògica del front

    res.json({
      error: false,
      data: {
        date: _novaDate,
        nCompra: nCompra
      }
    });
  }
}

module.exports = PostMethods;
