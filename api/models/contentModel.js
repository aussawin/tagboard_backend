const mysql = require('mysql')
const database = require('../../database')
const fs = require('fs')
// const multer = require('multer')

exports.getSubscribedTagPost = function(callback) {
    let sql = 'SELECT tag_id FROM user_subscribe ' +
              'WHERE user_id = 1'
    
    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, null, con)
        })
        .then(result => {
            let tagArray = ''

            for (i = 0; i < result.length; i++) {
                tagArray += ' ' + result[i].tag_id + ','
            }

            tagArray = tagArray.slice(0, -1)

            sql = 'SELECT post.subject, post.content, post.created_at, post.view, post.no_of_comment, post.no_of_like, ' +
                  'tag.tag_name, post.post_id ' +
                  'FROM post_tag ' +
                  'INNER JOIN post ON post_tag.post_id = post.post_id ' +
                  'INNER JOIN tag ON tag.tag_id = post_tag.tag_id ' +
                  'WHERE post_tag.tag_id IN (1, 2) ' +
                  'ORDER BY created_at DESC '

            return database.query(sql, null, con)
        })
        .then(result => {
            var post_array = []
            var tagname_array = []
            var subject_array = []
            var content_array = []
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
                    content_array.push(element.content)
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
            
            var data = []
            
            for (i=0; i<post_array.length; i++) {
                data.push({
                    post_id : post_array[i],
                    tag_name : tagname_array[i],
                    subject : subject_array[i],
                    content : content_array[i],
                    created_at : created_at_array[i],
                    view : view_array[i],
                    no_of_comment : no_of_comment_array[i],
                    no_of_like : no_of_like_array[i]
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

exports.getMostSubscribed = function(callback) {
    let sql = 'SELECT tag.tag_name AS tag_name, COUNT(*) AS no_of_sub ' +
              'FROM user_subscribe ' +
              'INNER JOIN tag ON tag.tag_id = user_subscribe.tag_id ' +
              'GROUP BY user_subscribe.tag_id ' +
              'ORDER BY no_of_sub DESC LIMIT 5'

    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, null, con)
        })
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
    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, null, con)
        })
        .then(result => {
            callback(null, result)
            database.release()
        })
}

exports.addPost = function(data, callback) {
    let tags = data.tags.split(',')
    let sql = 'INSERT INTO post SET ?'
    let body = {
        subject : data.subject,
        content : data.content,
        view : 0,
        created_by : 1,
        no_of_comment : 0,
        no_of_like : 0
    }
    let status = true
    let post_id
    let con

    database.getConnection()
        .then(connection => {
            con = connection
            return database.query(sql, body, con)
        })
        .then(result => {
            if (result.affectedRows != 0) {
                post_id = result.insertId

                sql = 'SELECT tag_name from tag ' +
                      'INNER JOIN post_tag ON tag.tag_id = post_tag.tag_id ' +
                      'GROUP BY tag.tag_id'
                
                return database.query(sql, null, con)
            }
        })
        .then(result => {
            sql = 'INSERT INTO tag (tag_name) VALUES'

            let oldTag = []
            let count = 0
            
            result.forEach(element => {
                oldTag.push(element.tag_name)
            })

            tags.forEach(element => {
                if (!oldTag.includes(element)) {
                    sql += ' ("' + element + '"),'

                    count++
                }
            })

            sql = sql.slice(0, -1)

            return count > 0? database.query(sql, null, con) : null
        })
        .then(result => {
            let tagsArray = []
            
            for (i = 0; i < tags.length; i++) {
                tagsArray.push('"' + tags[i] + '"')
            }

            sql = 'SELECT tag_id FROM tag ' +
                  'WHERE tag_name IN (' + tagsArray + ')'

            return database.query(sql, null, con)
        })
        .then(result => {
            sql = 'INSERT INTO post_tag (post_id, tag_id) VALUES'

            for (i = 0; i < result.length; i++) {
                sql += ' (' + post_id + ', ' + result[i].tag_id + '),'
            }

            sql = sql.slice(0, -1)

            return database.query(sql, null, con)
        })
        .then(result => {
            sql = 'SELECT * FROM post WHERE post_id = ' + post_id

            return database.query(sql, null, con)
        })
        .then(result => {
            callback(null, result[0])
            return database.release(con)
        })
        .then(() => {})
        .catch(error => {
            console.log(error)
        })
}