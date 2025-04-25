// Este código se usa para realizar cambios masivos en la base de datos.
// Por ejemplo, añadir un nuevo cliente, modificar un fallo de tipografía, etc
//
//

const fs = require('fs');
const RUTA = './db/db2.json';

// Leer el fichero JSON
fs.readFile(RUTA, 'utf8', (err, data) => {
  if (err) {
    console.error('Error leyendo el fichero:', err);
    return;
  }

  try {
    // Parsear el JSON
    const json = JSON.parse(data);
    let _catgr = [];

    for (const categoria of json.categories) {
      // let _prodct = [];
      // for (const _producte of categoria.productes) {
      //   console.log('_producte: ', _producte);
      //   _producte.producte = {
      //     mercadona: _producte.mercadona,
      //     carrefour: _producte.carrefour
      //   };
      //   delete _producte.mercadona;
      //   delete _producte.carrefour;
      //   _prodct.push(_producte);
      // }
      // _catgr.push(_prodct);
    }

    json.categories = _catgr;

    // console.log(json);
    fs.writeFile(RUTA, JSON.stringify(json, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error escribiendo en el fichero:', err);
        return;
      }
      console.log('Fichero actualizado correctamente');
    });
  } catch (error) {
    console.error('Error parseando el JSON:', error);
  }
});
