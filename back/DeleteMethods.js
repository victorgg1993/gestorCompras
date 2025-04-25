const DatabaseManager = require('./DatabaseManager');

class DeleteMethods {
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

  // el treu només de les compres manuals
  compresManuals(req, res, dirname) {
    this.dbJson = DatabaseManager.readJson(this.ruta);

    const nuevoArray = this.dbJson.compresManuals.filter((objeto) => {
      return objeto.producte[req.body.supermercat].id !== req.body.id;
    });

    this.dbJson.compresManuals = nuevoArray;

    DatabaseManager.writeJson(this.dbJson, this.ruta);

    res.json(this.dbJson.compresManuals);
  }

  // l'esborra de la DB
  product(req, res, dirname) {}
}

module.exports = DeleteMethods;
