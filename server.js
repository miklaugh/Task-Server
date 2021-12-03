// TodoApp db server

//DBserver
const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

// mytodos route

const mytodosRoutes = require ('./routes/mytodos')
/*
const pupilRoutes = require('./routes/pupils')
const memberRoutes = require('./routes/members')
*/
//cross-origin-resource-sharing
app.use(cors())
// automatic parsing of json
app.use(express.json())

app.use(express.urlencoded({extended:false}))

app.get('/',(req, res) => res.send('Server Running...'));

app.use('/api/mytodos/',mytodosRoutes);
/*
app.use('/api/pupils/', pupilRoutes);
app.use('/api/members/', memberRoutes);
*/
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

