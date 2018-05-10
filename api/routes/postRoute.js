module.exports = function(app) {
    const controller = require('../controllers/postController')

    app.route('/api/comment/:postId')
        .post(controller.addComment)

    app.route('/api/readpost/:postId')
        .get(controller.readPost)

    app.route('/api/readcomment/:postId')
        .post(controller.readComment)
}