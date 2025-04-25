class Common {
  constructor() {}

  getProductCategory(_json, _id, supermercat) {
    for (let i = 0; i < _json.categories.length; i++) {
      for (let j = 0; j < _json.categories[i].productes.length; j++) {
        if (_json.categories[i].productes[j].producte[supermercat].id === _id) {
          return _json.categories[i].title;
        }
      }
    }
    return '';
  }

  productExists(_json, _id, supermercat) {
    let _ret = this.getProductCategory(_json, _id, supermercat);
    return { exists: !!_ret, category: _ret };
  }

  // editProduct(_json, producte) {
  //   // esborrar el producte antic
  //   //
  //   //

  //   // afegir-lo en la nova categoria
  //   return this.addProduct(_json, producte);
  // }

  addProduct(_json, _obj) {
    let error = true;
    let msg = "Error a l'actualitzar el producte";

    for (let i = 0; i < _json.categories.length; i++) {
      if (_json.categories[i].title == _obj.categoria) {
        delete _obj.categoria; // no guardem el 'categoria'

        _json.categories[i].productes.push(_obj);
        error = false;
        msg = 'Producte afegit';
        break;
      }
    }
    return { error, msg };
  }

  removeProduct(_json, _id, supermercat) {
    let error = true;
    let msg = 'Error al eliminar el producte';

    let _copia = { ..._json };
    for (let i = 0; i < _copia.categories.length; i++) {
      for (let j = 0; j < _copia.categories[i].productes.length; j++) {
        //
        if (_copia.categories[i].productes[j].producte[supermercat].id == _id) {
          //
          _copia.categories[i].productes.splice(j, 1);
          i = _copia.categories.length; // per a sortir del bucle superior
          break;
        }
      }
    }

    error = false;
    msg = '';
    return { error, msg, data: _copia };
  }
}

module.exports = Common;
