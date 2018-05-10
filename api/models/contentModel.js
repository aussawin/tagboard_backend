const mysql = require('mysql')
const database = require('../../database')
const fs = require('fs')

exports.getSubscribedTagPost = function(callback) {
    let sql = 'SELECT tag_id FROM user_subscribe ' +
              'WHERE user_id = 1'
    
    database.query(sql)
        .then(result => {
            let tagArray = ''

            for (i = 0; i < result.length; i++) {
                tagArray += result[i].tag_id

                if (i != result.length - 1) {
                    tagArray += ', '
                }
            }

            sql = 'SELECT subject, content, created_at, view, no_of_comment, no_of_like, created_by ' + 
                  'FROM post_tag ' +
                  'INNER JOIN post ON post_tag.post_id = post.post_id ' +
                  'WHERE post_tag.tag_id IN (' + tagArray + ') ' +
                  'GROUP BY post.post_id ' + 
                  'ORDER BY created_at DESC'

            return database.query(sql)
        })
        .then(result => {
            callback(null, result)
            database.release()
        })
        .catch(error => {
            console.log(error)
        })
}

exports.getMostSubscribed = function(callback) {
    let sql = 'SELECT tag.tag_name AS tag_name, COUNT(*) AS no_of_sub ' +
              'FROM user_subscribe ' +
              'INNER JOIN tag ON tag.tag_id = user_subscribe.tag_id ' +
              'GROUP BY user_subscribe.tag_id ' +
              'ORDER BY no_of_sub DESC LIMIT 5'

    database.query(sql)
        .then(result => {
            callback(null, result)
            database.release()
        })
        .catch(error => {
            console.log(error)
        })
}

exports.getHotPost = function(callback) {
    let sql = 'SELECT post_id, subject FROM post ' + 
              'ORDER BY view DESC LIMIT 5'

    database.query(sql)
        .then(result => {
            callback(null, result)
            database.release()
        })
}

exports.addPost = function(data, callback) {
    let sql = 'INSERT INTO post (subject, content, view, created_by, no_of_comment, no_of_like) ' +
              'VALUES ("' +
              data.subject + '", "' +
              data.content + '", ' +
              '0, "' +
              data.created_by + '", ' +
              '0, 0)'
    
    database.query(sql)
        .then(result => {
            console.log(result)
            if (result.affectedRows != 0) {
                console.log(result.insertId)
                sql = 'SELECT * FROM post ' +
                      'WHERE post.post_id = ' + result.insertId

                return database.query(sql)
            }
        })
        .then(result => {
            callback(null, result)
            database.release()
        })
        .catch(error => {
            console.log(error)
        })
}