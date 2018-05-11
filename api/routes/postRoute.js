module.exports = function(app) {
    const controller = require('../controllers/postController')
    const userController = require('../controllers/userController')

    app.route('/api/addcomment/:postId')
        .get(userController.verifyToken)
        .post(controller.addComment)

    app.route('/api/post/:postId')
        .get(userController.verifyToken, controller.getPost)
        .delete(controller.deletePost)

    app.route('/api/comment/:postId')
        .get(userController.verifyToken)
        .post(controller.getComment)

    app.route('/api/myfeed/:name')
        .get(userController.verifyToken, controller.getMyPost)
    
    app.route('/api/view/:postId')
        .get(userController.verifyToken, controller.updatePostView)

    app.route('/api/like/:postId')
        .get(userController.verifyToken, controller.likePost)
}