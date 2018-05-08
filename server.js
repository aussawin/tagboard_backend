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

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports = getConnection;

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "tagboard"
  });

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO tag (tag_name) VALUES ?";
    var values = [['t1'], ['t2'], ['t3']]
    con.query(sql, [values], function(err, result) {
        if(err) throw err
        console.log(result.affectedRows+ ' record(s) is inserted')
    })
});
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(bodyParser.json())


app.listen(port)
console.log('Server started on: ' + port )
