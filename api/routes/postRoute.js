module.exports = function(app) {
    const controller = require('../controllers/postController')

    app.route('/api/addcomment/:postId')
        .post(controller.addComment)

    app.route('/api/post/:postId')
        .get(controller.getPost)

    app.route('/api/comment/:postId')
        .post(controller.getComment)

    app.route('/api/myfeed/:username')
        .get(controller.getMyPost)
    
    app.route('/api/view/:postId')
        .post(controller.updatePostView)
}