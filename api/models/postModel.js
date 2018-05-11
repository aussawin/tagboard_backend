const mysql = require('mysql')
const database = require('../../database')

exports.addComment = function(postId, data, callbaack) {
    console.log("postId: " + postId)
    let sql = 'INSERT INTO comment (content, created_by, post_id) ' +
              'VALUES ("' +
              data.content + '", ' +
              data.created_by + ', ' +
              postId + ')'
    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, null, con)
        })
        .then(result => {
            if (result.affectedRows > 0) {
                sql = 'SELECT no_of_comment AS comments FROM post ' +
                      'WHERE post_id = ' + postId

                return database.query(sql, null, con)
            }
        })
        .then(result => {
            let comments = parseInt(result[0].comments) + 1
            sql = 'UPDATE post ' + 
                  'SET no_of_comment = ' + comments + ' ' +
                  'WHERE post_id = ' + postId
            
            console.log("comment3: " + comments)

            return database.query(sql, null, con)
        })
        .then(result => {
            if (result.affectedRows > 0) {
                sql = 'SELECT comment.content, user.name, user.imgurl FROM comment ' +
                      'INNER JOIN user ON comment.created_by = user.user_id ' +
                      'WHERE comment.comment_id = ' + result.insertId

                return database.query(sql, null, con)
            }
        })
        .then(result => {
            console.log(result)
            callbaack(null, result)
            database.release(con)
        })
        .catch(error => {
            console.log(error)
        })
}

exports.getPost = function(postId, callback) {
    let sql = 'SELECT post.subject, post.content, post.view, post.created_at, post.no_of_comment, post.no_of_like, user.name, user.bio ' +
              'FROM post INNER JOIN user ON post.created_by = user.user_id ' +
              'WHERE post.post_id = ' + postId
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

exports.getComment = function(postId, start, callback) {
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

exports.getMyPost = function(name, callback) {
    let sql = 'SELECT post.subject, post.created_at, post.view, post.no_of_comment, post.no_of_like, ' +
              'tag.tag_name, post.post_id ' +
              'FROM user ' +
              'INNER JOIN post ON post.created_by = user.user_id ' +
              'INNER JOIN post_tag ON post_tag.post_id = post.post_id ' +
              'INNER JOIN tag ON tag.tag_id = post_tag.tag_id ' +
              'WHERE user.name = "' + name + '" ' +
              'ORDER BY created_at DESC'
    let connection

    database.getConnection()
        .then(con => {
            connection = con

            return database.query(sql, null, connection)
        })
        .then(result => {
            var post_array = []
            var tagname_array = []
            var subject_array = []
            var created_at_array = []
            var view_array = []
            var no_of_comment_array = []
            var no_of_like_array = []

            result.forEach(element => {
                var isContain = post_array.includes(element.post_id)
                if (!isContain) {
                    post_array.push(element.post_id)
                    tagname_array.push(element.tag_name)
                    subject_array.push(element.subject)
                    created_at_array.push(element.created_at)
                    view_array.push(element.view)
                    no_of_comment_array.push(element.no_of_comment)
                    no_of_like_array.push(element.no_of_like)
                }
                else {
                    var index = post_array.indexOf(element.post_id)
                    tagname_array[index] += ',' + element.tag_name
                }
            })

            console.log(tagname_array)

            var data = []
            
            for (i=0; i<post_array.length; i++) {
                data.push({
                    post_id : post_array[i],
                    tags : tagname_array[i],
                    title : subject_array[i],
                    post_at : created_at_array[i],
                    views : view_array[i],
                    likes : no_of_comment_array[i],
                    comments : no_of_like_array[i]
                })
            }
            console.log(data)

            callback(null, data)
            database.release(con)
        })
        .catch(error => {
            console.log(error)
        })
}

exports.updatePostView = function(postId, callback) {
    let sql = 'SELECT view FROM post ' +
              'WHERE post_id = ' + postId + ' '
    let connection
    let view

    database.getConnection()
        .then(con => {
            connection = con
            return database.query(sql, null, connection)
        })
        .then(result => {
            view = parseInt(result[0].view) + 1

            sql = 'UPDATE post ' +
                  'SET view = ' + view + ' ' +
                  'WHERE post_id = ' + postId

            return database.query(sql, null, connection)
        })
        .then(result => {
            if (result.affectedRows > 0) {
                let response = {
                    view: view
                }

                callback(null, response)
                database.release(connection)
            }
        })
        .catch(error => {
            console.log(error)
        })
}

exports.deletePost = function(postId, callback) {
    let connection

    database.getConnection()
        .then(con => {
            connection = con

            let sql = 'DELETE FROM post ' +
                      'WHERE post_id = ' + postId

            return database.query(sql, null, connection)
        })
        .then(result => {
            if (result.affectedRows > 0) {
                let response = {
                    message: "DELETE SUCCESSFUL!"
                }

                callback(null, response)
                database.release(connection)
            }
        })
        .catch(error => {
            console.log(error)
        })
}

exports.likePost = function(postId, callback) {
    let connection
    let likeNo
    let isLiked
    let sql

    database.getConnection()
        .then(con => {
            connection = con
            sql = 'SELECT COUNT(*) AS liked, post.no_of_like AS like_no FROM like_by ' +
                      'INNER JOIN post ON post.post_id = like_by.post_id ' +
                      'WHERE post.post_id = ' + postId
                      + ' AND user_id = ' + req.uid

            return database.query(sql, null, connection)
        })
        .then(result => {
            console.log("like: " + result[0].liked)
            likeNo = parseInt(result[0].like_no)
            sql = 'UPDATE post '

            if(!result[0].liked) {
                likeNo++
                sql += 'SET no_of_like = ' + likeNo
                isLiked = true
            } else {
                likeNo--
                sql += 'SET no_of_like = ' + likeNo
                isLiked = false
            }

            sql += ' WHERE post_id = ' + postId

            return database.query(sql, null, connection)
        })
        .then(result => {
            sql = 'DELETE like_by ' +
                  'WHERE post_id = ' + postId
                  + ' AND user_id = ' + req.uid

            return !isLiked? database.query(sql, null, connection) : null
        })
        .then(result => {
            let response = {
                likes: likeNo
            }

            callback(null, response)
            database.release(connection)
        })
        .catch(error => {
            console.log(error)
        })
}