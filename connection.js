const mysql = require('mysql');

const {DB_HOST,DB_USER,DB_PASSWORD,DB_NAME} = process.env;

const db = mysql.createPool({
  connectionLimit:10,
  host:DB_HOST,
  user:DB_USER,
  password:DB_PASSWORD,
  database:DB_NAME
});

// test connection to todos.db
db.getConnection((err,connection)=>{  
  if (err) console.error("Error:",err)
  else{
    console.log("Connection to 'todos.db' okay.",connection.threadId);
    connection.release() // return test connection to the pool
  } 
})

module.exports = { db };