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

app.use(express.static("./assets/"));//funcao para ser possivel renderizar itens estaticos

app.get('/', function (req, resp){//get index
  resp.render('index');//renderiza a view correspondente
});
app.get('/login', function(req, resp){//get da view login (render normal)
  resp.render('login');
});

app.post('/login', function(req, resp){//post da view login (consulta o banco)
  var login = req.body.login;//pega variáveis do formulario
  var senha = req.body.senha;

  const connection = mysql.createConnection({//conexao com o banco
    host: 'engsoft2020.mysql.dbaas.com.br',
    user: 'engsoft2020',
    password: 'a123456',
    database: 'engsoft2020'
  });
  var user = [];//variavel que vai receber os dados do banco
  tipo = req.body.tipo;//radio do tipo de usuário
  if(tipo == "radAluno"){//aluno
    var query = mysql.format("SELECT * FROM aluno where login=? and senha=?", [login, senha]);//formatacao da query
    connection.query(query, (err,rows) => {//funcao para aplicar a query
      if(err) throw err;
      user = rows;//atribuicao dos dados recebidos do banco
    });
    if(user.length > 0){
      console.log("Aluno logou");
      //faz algo se existir um login e senha compatível
    }
    else{
      console.log("Incorreto");//faz algo se nao existir
    }
  }
  else if(tipo == "radResp"){//responsavel
    var query = mysql.format("SELECT * FROM responsavel where login=? and senha=?", [login, senha]);
    connection.query(query, (err,rows) => {
      if(err) throw err;
      user = rows;
    });
    if(user.length > 0){
      console.log("Responsavel logou");
    }
    else{
      console.log("Incorreto");
    }
  }
  else if(tipo == "radTutor"){//tutor
    var query = mysql.format("SELECT * FROM tutor where login=? and senha=?", [login, senha]);
    connection.query(query, (err,rows) => {
      if(err) throw err;
      user = rows;
    });
    if(user.length > 0){
      console.log("Tutor logou");
    }
    else{
      console.log("Incorreto");
    }
  }
  else{
    console.log("ERRO");//caso nenhum dos tipos seja selecionado é necessario ocorrer um erro
  }
  connection.end();//fecha conexao com banco
})

app.get('/cadastro', function(req, resp){
  resp.render('cadastro');
});

app.post('/cadastro', function(req, resp){
  const connection = mysql.createConnection({//conexao com o banco
    host: 'engsoft2020.mysql.dbaas.com.br',
    user: 'engsoft2020',
    password: 'a123456',
    database: 'engsoft2020'
  });
  var tipo = req.body.tipo;
  var nome = req.body.nome;
  var login = req.body.login;
  var senha = req.body.senha;
  if(tipo == 'radAluno'){
    var query = mysql.format("INSERT into aluno (nome, login, senha) VALUES (?, ?, ?);", [nome, login, senha]);
    connection.query(query, (err,rows) => {
      if(err) throw err;
    });
  }
  else if(tipo == 'radResp'){
    var query = mysql.format("INSERT into responsavel (nome, login, senha) VALUES (?, ?, ?);", [nome, login, senha]);
    connection.query(query, (err,rows) => {
      if(err) throw err;
    });
  }
  else if(tipo == 'radTutor'){
    var query = mysql.format("INSERT into tutor (nome, login, senha) VALUES (?, ?, ?);", [nome, login, senha]);
    connection.query(query, (err,rows) => {
      if(err) throw err;
    });
  }
  else{
    console.log("Erro");
  }
  connection.end();
})

const server = http.createServer(app);//criacao do servidor
server.listen(1000);//definicao da porta do servidor
console.log('Servidor Conectado');
