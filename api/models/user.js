var mysql = require('mysql')
var pool = require('../../server')

exports.getAllUser = function(req, res) {
    pool.getConnection(function(err, connection) {
        var sql = "SELECT * FROM user"
        connection.query(sql, function(err, result) {
            if(err) throw err
            connection.release()
            res.json(result)
        })
    })
}