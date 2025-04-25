const DatabaseManager = require('./DatabaseManager');
const Common = require('./Common');

class PatchMethods {
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

  // to-do: arreglar, fer que pugui actualitzar un sol element
  compresManuals(req, res, dirname) {
    this.dbJson = DatabaseManager.readJson(this.ruta);

    let resultat = this._agregarElementosFaltantes(
      req.body,
      this.dbJson.compresManuals
    );

    this.dbJson.compresManuals = resultat;
    DatabaseManager.writeJson(this.dbJson, this.ruta);

    res.json({ error: false, data: this.dbJson.compresManuals });
  }

  producte(req, res, dirname) {
    res.json({ error: true, data: 'dummy' });
  }

  // private
  _agregarElementosFaltantes(elementoUsuario, arrayElementosDB) {
    let copiaArrayElementosDB = [...arrayElementosDB];
    let exists = false;

    for (let i = 0; i < copiaArrayElementosDB.length; i++) {
      const _keys = Object.keys(copiaArrayElementosDB[i].producte);
      const keyLeida = _keys[0];

      const idProducteDB = copiaArrayElementosDB[i].producte[keyLeida].id;
      const idProducteUser = elementoUsuario.producte[keyLeida].id;
      const superm = elementoUsuario.supermercat;

      // Si hi és, ++ unitats
      if (idProducteDB == idProducteUser) {
        if (elementoUsuario.incrementDecrement === true) {
          // si la compra l'ha afegit l'usuari, el valor
          // ha d'afectar a tots els supermercats.
          // D'aquesta manera, si l'usuari volia 2 de café de forma puntual,
          // en tots els supermercats es veurà afectat
          if (elementoUsuario.afegitUser === true) {
            for (const _key of _keys) {
              copiaArrayElementosDB[i].producte[_key].unitats =
                elementoUsuario.producte[superm].unitats;
            }
          }
          //
          else {
            copiaArrayElementosDB[i].producte[superm].unitats =
              elementoUsuario.producte[superm].unitats;
          }
        }
        //
        else {
          // Aquí si importa a quin supermercat incrementem
          copiaArrayElementosDB[i].producte[superm].unitats += 1;
        }

        exists = true;
        break;
      }
    }

    // Si no hi és, s'afegeix
    if (!exists) {
      copiaArrayElementosDB.push(elementoUsuario);
    }

    return copiaArrayElementosDB;
  }
}

module.exports = PatchMethods;
