const express = require('express');
const router = express.Router()
const mysql = require('mysql'); 
const { db } = require('../connection.js')
console.log('My DB_HOST at mytodos Env:',process.env.DB_HOST);
// a test to check node mysql statements
// uses mysql.format to parse the statement
// req.body: {statement:<statement>}
// returns: parsed result
router.post('/sqltest',(req,res)=>{
  let stmt = req.body.statement;
  let inserts = req.body.inserts;
  console.log('sqltest req.body=',stmt,inserts);
  let sql = mysql.format(stmt, [inserts]);
  return new Promise ((resolve,reject)=>{  
    resolve(res.send(sql))
  })//promise
})// router.get 

// inserts a todo into the mytodos table in the todos db
router.post('/add',(req,res)=>{
  console.log('Entered router!')
  //const toDo = req.body.newToDo;
  console.log('Entered /add on server router');
  console.log('Req params:',req.params);
  console.log('Req body:',req.body);
  console.log('Req query: ',req.query);
  console.log('Req url', req.url);
  let toDo=req.body;
  console.log ('Server todo:', toDo);

  const sqlAdd = `INSERT  INTO mytodos (description, due) VALUES (?,?)`;
  return new Promise ((resolve,reject)=>{
    db.query(sqlAdd,toDo,(err,data)=>{
      
      if (err){
        console.log('Add rejected.');
        reject(res.send(err.message))
      }else{
        console.log('Add resolved');
        resolve (res.send(data))
      }//if(err) else...
      
    })//db.query
  })//promise
})// router.post

router.delete('/delete/:id', (req, res) => {

  const pID = req.params.id;
 
  const sqlDelete= `DELETE FROM mytodos WHERE todo_id = ?`
  console.log('Entered delete with param:',pID);

  return new Promise((resolve, reject) => {
    db.query(sqlDelete, [pID], (err,data)=>{
      if (err){
        console.log('Promise rejected.')
        reject(res.send(err.message))
      }else{
        console.log('Promise resolved data:',data)
        resolve(res.send(`Deleted:${pID}`))
      } 
    }) 
  })
  
})

// batch inserts rows defined in toDos arrayOfarrays req.body into mytodos 
router.post('/addAll',(req,res)=>{
  console.log('Entered router!')
  //const toDo = req.body.newToDo;
  console.log('Entered /addAll on server router');
  
  let toDos=req.body;
  console.log ('Server todo:', toDos);

  const sqlAddAll = `INSERT  INTO mytodos (description, due) VALUES ?`;
  return new Promise ((resolve,reject)=>{
    db.query(sqlAddAll,[toDos],(err,data)=>{
      if (err){
        console.log('AddAll rejected.');
        reject(res.send(err.message))
      }else{
        console.log('AddAll resolved');
        resolve (res.send(data))
      }
    })
  })
})

// batch deletes all rows matching the array of todo_ids passed in req.body
// note a bulk delete to work was a monumental pain in the dink!!!!
// ...mainly because it is so badly documented both in npm mysql docs.
// ...and in the many tutorials, discussions on the topic.
// ...Thankfully, after many hours I discovered the syntax.
// ... 1.When an array is passed via the body and a place-holder used with 'IN'
// ...then place-holder must be to be enclosed in (?) braces
// ...2. The array name must be in [] brackets. 
router.post('/deleteAll',(req,res)=>{
  
  console.log('Entered /deleteAll on server router!');
  
  let todo_ids=req.body;
  console.log ('Server todo id array:', todo_ids);

  const sqlDeleteAll = 'DELETE FROM mytodos WHERE todo_id IN (?)';
  return new Promise ((resolve,reject)=>{
    db.query(sqlDeleteAll,[todo_ids],(err,data)=>{
      if (err){
        console.log('deleteAll rejected.');
        reject(res.send(err.message))
      }else{
        console.log('deleteAll resolved');
        resolve (res.send(data))
      }
    })
  })
  
})
// returns list of elements from mytodos table
// db: connection to the todos MySQL database
// sqlList: MySql query on mytodos database table
// data: result of sucessful query
// err : result of failed query
router.get('/list', (req, res) => {
   
  const sqlList=(`SELECT * FROM mytodos`)
  return new Promise((resolve, reject) => {
    db.query(sqlList,(err,data)=>{
      if (err){
        console.log('Promise rejected.')
        reject(res.send(err.message))
      }else{
        console.log('Promise resolved data:',data)
        resolve(res.send(data))
      } 
    }) //db.query(...) 
  }) // return new Promise(...)
})// router.get(...)

// updates column @ todo_id
router.put('/update/:id', (req, res) => {
let update = req.body;
let id = req.params.id;

console.log('update.task, update.now, id:',update, id);

  const sqlUpdate=`UPDATE mytodos 
    SET description = ?, due = ? WHERE todo_id = ?`;
  
  return new Promise((resolve, reject) => {
    db.query(sqlUpdate,[update.task, update.now, id], (err,data)=>{
      if (err){
        console.log('Promise rejected.')
        reject(res.send(err.message))
      }else{
        console.log('Promise resolved update data:',data)
        resolve(res.send(data))
      } 
    }) //db.query(...) 
  }) // return new Promise(...)
 
})// router.put(...)

module.exports = router
