const mysql = require('mysql');

/*
const connection = mysql.createConnection({
  host: 'engsoft2020.mysql.dbaas.com.br',
  user: 'engsoft2020',
  password: 'a123456',
  database: 'engsoft2020'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado');
});

connection.end();
------------------------------------------------------------
CRUD:
READ: connection.query('SELECT * FROM authors', (err,rows) => {
  if(err) throw err;

  console.log('Data received from Db:');
  console.log(rows);
});

CREATE:
const author = { name: 'Craig Buckler', city: 'Exmouth' };
connection.query('INSERT INTO authors SET ?', author, (err, res) => {
  if(err) throw err;

  console.log('Last insert ID:', res.insertId);
});

UPDATE: 
connection.query(
  'UPDATE authors SET city = ? Where ID = ?',
  ['Leipzig', 3],
  (err, result) => {
    if (err) throw err;

    console.log(`Changed ${result.changedRows} row(s)`);
  }
);

DELETE: 
connection.query(
  'DELETE FROM authors WHERE id = ?', [5], (err, result) => {
    if (err) throw err;

    console.log(`Deleted ${result.affectedRows} row(s)`);
  }
);
*/

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static("./assets/"));

app.get('/', function (req, resp){
  resp.render('index');
});

const server = http.createServer(app);
server.listen(1000);
