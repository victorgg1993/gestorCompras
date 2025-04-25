// V0.0.3

fs = require('fs');

class Debugger {
  TYPE = {
    ERROR: 'Error',
    DEBUG: 'Debug',
    INFO: 'Info',
    WARNING: 'Warning'
  };

  constructor(_path) {
    this.PATH_FITXER = './debug.log';

    if (_path) {
      this.PATH_FITXER = _path;
    }
  }

  log(type, arxiu, funcio, msg, msg2, msg3) {
    let _d = new Date();

    let hora = this.getHora(_d);
    let dia = this.getDia(_d);
    let _msg = `${msg ? msg : ''} ${msg2 ? msg2 : ''} ${msg3 ? msg3 : ''}`;

    let text = `${dia} - ${hora} - ${type}: ${arxiu} => ${funcio}: ${_msg}`;
    console.log(text);
    fs.appendFileSync(this.PATH_FITXER, `${text}\r\n`);
  }

  // ------------------------------------------------
  debug(arxiu, funcio, msg, msg2, msg3) {
    this.log(this.TYPE.DEBUG, arxiu, funcio, msg, msg2, msg3);
  }

  info(arxiu, funcio, msg, msg2, msg3) {
    this.log(this.TYPE.INFO, arxiu, funcio, msg, msg2, msg3);
  }

  error(arxiu, funcio, msg, msg2, msg3) {
    this.log(this.TYPE.ERROR, arxiu, funcio, msg, msg2, msg3);
  }

  warning(arxiu, funcio, msg, msg2, msg3) {
    this.log(this.TYPE.WARNING, arxiu, funcio, msg, msg2, msg3);
  }

  // ------------------------------------------------

  // Padding números ( afegir 0 davant )
  padNum(num) {
    return String(num).padStart(2, '0');
  }

  // Day dd/MM/YYYY
  getDia(_d) {
    return `${this.getDa(_d)}/${this.getMo(_d)}/${this.getYe(_d)}`;
  }
  getDa(_d) {
    return this.padNum(_d.getDate());
  }
  getMo(_d) {
    return this.padNum(_d.getMonth() + 1);
  }
  getYe(_d) {
    return this.padNum(_d.getFullYear());
  }

  // Time hh:mm:ss:ms:ms
  getHora(_d) {
    return `${this.getH(_d)}:${this.getM(_d)}:${this.getS(_d)}:${this.getMs(
      _d
    )}`;
  }
  getH(_d) {
    return this.padNum(_d.getHours());
  }
  getM(_d) {
    return this.padNum(_d.getMinutes());
  }
  getS(_d) {
    return this.padNum(_d.getSeconds());
  }
  getMs(_d) {
    return this.padNum(_d.getMilliseconds());
  }
}

module.exports = Debugger;
