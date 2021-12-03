const mysql = require('mysql');

const db = mysql.createPool({
  connectionLimit:10,
  host:'localhost',
  user:'root',
  password:'frontline',
  database:'todos'
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