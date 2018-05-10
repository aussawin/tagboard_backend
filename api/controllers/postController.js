const mysql = require('mysql')
const pool = require('../../server')
const postModel = require('../models/postModel')

exports.addComment = function(req, res) {
    postModel.addComment(req.params, req.body, (error, data) => {
        if (error) throw error

        res.json(data)
    })
}

exports.readPost = function(req, res) {
    console.log(req.params)
    postModel.readPost(req.params, (error, data) => {
        if (error) throw err

        res.json(data)
    })
}

exports.readComment = function(req, res) {
    postModel.readComment(req.params.postId, req.body.start, (error, data) => {
        if (error) throw err

        res.json(data)
    })
}