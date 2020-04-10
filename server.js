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
READ: 
  connection.query('SELECT * FROM authors', (err,rows) => {
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
const mysql = require('mysql');

const app = express();

app.set('view engine', 'ejs');//view engine é ejs

app.use(bodyParser.urlencoded({extended:false}));//nao inserir objeto na url
app.use(bodyParser.json());//parser para json

app.use(express.static("./public"));//funcao para ser possivel renderizar itens estaticos

app.get('/', function (req, resp){//get index
  resp.render('index');//renderiza a view correspondente
});
app.get('/login', function(req, resp){//get da view login (render normal)
  resp.render('login', {message: ''});
});

app.post('/login', function(req, resp){//post da view login (consulta o banco)
  const connection = mysql.createConnection({//conexao com o banco
    host: 'engsoft2020.mysql.dbaas.com.br',
    user: 'engsoft2020',
    password: 'a123456',
    database: 'engsoft2020'
  });
  var login = req.body.login;//pega variáveis do formulario
  var senha = req.body.senha;
  var user = [];//variavel que vai receber os dados do banco
  var query = mysql.format("SELECT * FROM usuarios where login=?;", [login]);//formatacao da query

  connection.query(query, (err,rows) => {//funcao para aplicar a query
    if(err) throw err;
    user = rows;//atribuicao dos dados recebidos do banco
    connection.end();
    if(user && user.length > 0 && user[0].senha == senha){//Usuario logado
      if(user[0].tipo==0){
        resp.redirect('/administracao');

        app.get('/administracao', function(req, resp){
          resp.render('administracao/index-adm');
        });

        app.get('/administracao/cadastro', function(req, resp){
          resp.render('administracao/cadastro');
        });

        app.post('/administracao/cadastro', function(req, resp){
          const connection = mysql.createConnection({//conexao com o banco
            host: 'engsoft2020.mysql.dbaas.com.br',
            user: 'engsoft2020',
            password: 'a123456',
            database: 'engsoft2020'
          });
          var nome = req.body.nome;
          var sobrenome = req.body.sobrenome;
          var login = req.body.login;
          var senha = req.body.senha;
          var tipo = parseInt(req.body.tipo);
          var query = mysql.format("INSERT INTO usuarios (nome, sobrenome, login, senha, tipo) VALUES (?, ?, ?, ?, ?);", [nome, sobrenome, login, senha, tipo]);
            connection.query(query, (err,rows) => {
              if(err) throw err;
              connection.end();
          });
        });
    }
    }
    else{
      msg = 'Usuário incorreto ou inesistente';
      resp.render('login', {message: msg});
    }
  });
});


const server = http.createServer(app);//criacao do servidor
server.listen(1000);//definicao da porta do servidor
console.log('Servidor Conectado');
