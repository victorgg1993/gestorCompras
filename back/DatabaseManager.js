// V0.0.1
// És tot estàtic perquè si fas servir aquesta classe en llocs diferents,
// vols que tothom tingui les mateixes dades i no copies del json.

const fs = require('fs');

class DatabaseManager {
    static json = {};

    static init(path) {
        DatabaseManager.PATH = path;
        DatabaseManager.json = DatabaseManager.readJson(DatabaseManager.PATH);
    }

    // ----------------------- Generic
    static readJson(path) {
        let _data = {};
        _data = fs.readFileSync(path, 'utf8');
        return JSON.parse(_data);
    }

    static writeJson(json, path) {
        let data = JSON.stringify(json, undefined, 2); // prettier
        fs.writeFileSync(path, data);
    }
}

module.exports = DatabaseManager;
