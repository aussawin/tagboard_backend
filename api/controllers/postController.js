const mysql = require('mysql')
const pool = require('../../server')
const postModel = require('../models/postModel')

exports.addComment = function(req, res) {
    postModel.addComment(req.params.postId, req.body, (error, data) => {
        if (error) throw error

        res.json(data)
    })
}

exports.getPost = function(req, res) {
    console.log(req.params)
    postModel.getPost(req.params.postId, (error, data) => {
        if (error) throw err

        res.json(data)
    })
}

exports.getComment = function(req, res) {
    postModel.getComment(req.params.postId, req.body.start, (error, data) => {
        if (error) throw err

        res.json(data)
    })
}

exports.getMyPost = function(req, res) {
    postModel.getMyPost(req.uid, (error, data) => {
        if (error) throw error

        res.json(data)
    })
}

exports.updatePostView = function(req, res) {
    postModel.updatePostView(req.params.postId, (error, data) => {
        if (error) throw error

        res.json(data)
    })
}

exports.deletePost = function(req, res) {
    postModel.deletePost(req.params.postId, (error, data) => {
        if (error) throw error

        res.json(data)
    })
}

exports.likePost = function(req, res) {
    postModel.likePost(req.uid, req.params.postId, (error, data) => {
        if (error) throw error

        res.json(data)
    })
}