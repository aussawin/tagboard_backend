var express = require('express')
var bodyParser = require('body-parser')
var mysql = require('mysql');
var config = require('./config')
const path = require('path')

app = express()
port = process.env.PORT || 8081

pool = mysql.createPool(config)
global.pool = pool
global.config = config

app.use(bodyParser.json())
app.use('/public', express.static(path.join(__dirname, 'public')))

let route = require('./api/routes/userRoute')
let postRoute = require('./api/routes/contentRoute')

route(app)
postRoute(app)

app.listen(port)
console.log('Server started on: ' + port)