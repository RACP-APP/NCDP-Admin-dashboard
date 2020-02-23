var mysql = require('mysql');

var connection = mysql.createConnection({
  user: 'root',
  password: '1111',
  database: 'ncdp'
});

connection.connect(error => {
  if (error) console.log('Error Accure');
  console.log('DataBase Is Connected');
});

module.exports = connection;
