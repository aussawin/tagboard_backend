const mysql = require('mysql')
const database = require('../../database')

exports.addComment = function(postId, data, callbaack) {
    let sql = 'INSERT INTO comment (content, created_by, post_id) ' +
              'VALUES ("' +
              data.content + '", ' +
              '1, ' +
              postId.postId + ')'
    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, null, con)
        })
        .then(result => {
            console.log(result)
        })
}

exports.readPost = function(postId, callback) {
    console.log(postId.postId)

    let sql = 'SELECT post.subject, post.content, post.view, post.created_at, post.no_of_comment, post.no_of_like, user.name, user.bio ' +
              'FROM post INNER JOIN user ON post.created_by = user.user_id ' +
              'WHERE post.post_id = ' + postId.postId
    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, null, con)
        })
        .then(result => {
            callback(null, result[0])
            database.release(con)
        })
        .catch(error => {
            console.log(error)
        })
}

exports.readComment = function(postId, start, callback) {
    let sql = 'SELECT comment.content, user.name, user.imgurl FROM comment ' +
              'INNER JOIN user ON comment.created_by = user.user_id ' +
              'WHERE comment.post_id = ' + postId + ' ' +
              'ORDER BY comment.created_at ASC LIMIT 5 OFFSET ' + (start * 5)
    let connection

    database.getConnection()
        .then(con => {
            connection = con
            return database.query(sql, null, con)
        })
        .then(result => {
            callback(null, result)
            database.release(connection)
            console.log(result)
        })
        .catch(error => {
            console.log(error)
        })
}

exports.myPost = function(name, callback) {
    let sql = 'SELECT * FROM post '
}