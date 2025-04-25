// https://developer.mozilla.org/es/docs/Web/HTTP/Status

const express = require('express');
const cors = require('cors');
const GetMethods = require('./back/GetMethods');
const PutMethods = require('./back/PutMethods');
const PatchMethods = require('./back/PatchMethods');
const DeleteMethods = require('./back/DeleteMethods');
const Debugger = require('./back/Debugger');
const PostMethods = require('./back/PostMethods');
const SupermercatManager = require('./back/SupermercatsManager');

const app = express();
const PORT = process.env.PORT; // ha d'encaixar amb el port del docker-compose.yml si el fas servir
const IP = 'localhost';

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(cookieParser());

// ----------------------------------------------------------------Init
const get = new GetMethods();
const put = new PutMethods();
const patch = new PatchMethods();
const del = new DeleteMethods();
const post = new PostMethods();
const debug = new Debugger();
const supermercat = new SupermercatManager();

app.listen(PORT, () => {
  console.log(
    debug.TYPE.INFO,
    '1) main.js - ',
    'app.listen() - ',
    `Entra en: http://${IP}:${PORT}`
  );
  // debug.log(debug.TYPE.INFO, "main.js", "app.listen()", `Entra en: http://${IP}:${PORT}`);
});

// ----------------------------------------------------------------Get ( read )
app.get('/', (req, res) => {
  console.log('get /');
  get.home(req, res, __dirname);
});

app.get('/categories', (req, res) => {
  console.log('get /categories');
  get.categories(req, res, __dirname);
});

app.get('/titols-categories', (req, res) => {
  console.log('get /titols-categories');
  get.categoryTitles(req, res, __dirname);
});

app.get('/compres-manuals', (req, res) => {
  console.log('get /compres-manuals');
  get.compresManuals(req, res, __dirname);
});

app.get('/sessio', (req, res) => {
  console.log('get /sessio');
  get.sessio(req, res, __dirname);
});

app.get('/existeix', (req, res) => {
  console.log('get /existeix');
  get.existeix(req, res, __dirname);
});

app.get('/compra', (req, res) => {
  console.log('get /compra');
  get.compra(req, res, __dirname);
});

// ha d'anar després del get / o sino no executa el app.get '/'
app.use(express.static(__dirname + '/public'));

// ---------------------------------------------------------------- Post ( get + post data ) ( create )
app.post('/compra', (req, res) => {
  console.log('post /compra');
  post.compra(req, res, __dirname);
});

app.post('/parse-producte', (req, res) => {
  console.log('post /parse-producte');

  supermercat
    .getProductInfo(req.body.supermercat, req.body.url)
    .then((_data) => {
      res.json({ error: false, data: _data });
    })
    .catch((err) => {
      res.json({ error: true, data: err });
    });
});

// ---------------------------------------------------------------- Put ( update/edit )
// realment fa d'dafegir i d'actualitzar
app.put('/producte', (req, res) => {
  console.log('put /producte');
  put.producte(req, res, __dirname);
});

// ---------------------------------------------------------------- Patch ( push )
app.patch('/compres-manuals', (req, res) => {
  console.log('patch /compres-manuals');
  patch.compresManuals(req, res, __dirname);
});

app.patch('/producte', (req, res) => {
  console.log('patch /producte');
  patch.producte(req, res, __dirname);
});

// ---------------------------------------------------------------- Delete ( delete )
app.delete('/compres-manuals', (req, res) => {
  console.log('delete /compres-manuals');
  del.compresManuals(req, res);
});
