var express = require('express')
var bodyParser = require('body-parser')
var mysql = require('mysql');

app = express()
port = process.env.PORT || 8081

var pool  = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'tagboard'
});

module.exports = pool;

app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(bodyParser.json())

let route = require('./api/routes/route')
route(app)

app.listen(port)
console.log('Server started on: ' + port )
