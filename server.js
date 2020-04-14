/*
const connection = mysql.createConnection({
  host: 'engsoft2020.mysql.dbaas.com.br',
  user: 'engsoft2020',
  password: 'a123456',
  database: 'engsoft2020'
});
tipos:
0 - amdin
1 - aluno
2 - tutor
3 - pai

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
      if(user[0].tipo==0){//tipo administracao
        resp.redirect('/administracao');

        app.get('/administracao', function(req, resp){
          resp.render('administracao/index');
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
          connection.query(query, (err,rowsAlu) => {//VERIFICAR SE RETORNA O OBJETO INSERIDO
            if(err) throw err;
            connection.end();
            if(tipo === 1){//NA0 ESQUECER DE INSERIR NA TABELA DE RELAÇÃO DE PAI E ALUNO
              const connection = mysql.createConnection({//conexao com o banco
                host: 'engsoft2020.mysql.dbaas.com.br',
                user: 'engsoft2020',
                password: 'a123456',
                database: 'engsoft2020'
              });
              var pNome = req.body.pNome;
              var pSobrenome = req.body.pSobrenome;
              var pLogin = req.body.pLogin;
              var pSenha = req.body.pSenha;
              query = mysql.format("INSERT INTO usuarios (nome, sobrenome, login, senha, tipo) VALUES (?, ?, ?, ?, ?);", [pNome, pSobrenome, pLogin, pSenha, 3]);
              connection.query(query, (err,rowsPai) => {
                if(err) throw err;
                connection.end();
                const connection2 = mysql.createConnection({//conexao com o banco (nao sei pq derruba a conexao anterior)
                  host: 'engsoft2020.mysql.dbaas.com.br',
                  user: 'engsoft2020',
                  password: 'a123456',
                  database: 'engsoft2020'
                });
                query = mysql.format("INSERT INTO `relac-pai-alu` (idp, ida) VALUES (?, ?);", [rowsAlu.insertId, rowsPai.insertId]);
                connection2.query(query, (err,rows) => {
                  if(err) throw err;
                  connection2.end();
                });
              });
            }
          });
        });
        }else if(user[0].tipo==1){//tipo aluno
          resp.redirect('/aluno');

          app.get('/aluno', function(req, resp){
            resp.render('alunos/index');
          });
        }else if(user[0].tipo==2){//tipo tutor
          resp.redirect('/tutor');

          app.get('/tutor', function(req, resp){
            resp.render('tutores/index');
          });
        }else if(user[0].tipo==3){//tipo pai
          resp.redirect('/pai');

          app.get('/pai', function(req, resp){
            resp.render('pais/index');
          });
        }else{//caso tenha sido salvo de forma errada, não será nenhum dos anteriores
          console.log("Usuário salvo de forma errada");
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
