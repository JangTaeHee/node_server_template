const mysql = require('mysql');

const mysqlPool = mysql.createPool = {
  host     : 'host',
  user     : 'db user',
  password : 'db user pw',
  database : 'database name',
  multipleStatements: true
};
const oraclePool = {
  clmns : {
    connectString 			: 'host:1521/ORCL',
    //connectString 			: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=host)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=ORCL)))',
    user			: 'db user',
    password		: 'db user pw',
    poolMax : 20,
    poolMin : 5,
    poolIncrement : 5,
    poolTimeout : 4
  }
};

module.exports = {mysqlPool, oraclePool};
