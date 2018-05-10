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
app.use('/images', express.static(path.join(__dirname, 'public/images')))

let route = require('./api/routes/userRoute')
let contentRoute = require('./api/routes/contentRoute')
let postRoute = require('./api/routes/postRoute')

route(app)
contentRoute(app)
postRoute(app)

app.listen(port)
console.log('Server started on: ' + port)