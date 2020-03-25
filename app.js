const mysql = require('mysql');
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