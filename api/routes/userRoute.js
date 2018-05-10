module.exports = function(app){
    var userController = require('../controllers/userController')
    
    app.route('/api/getAllUser')
        .get(userController.getAllUser)
        
    app.route('/api/createdUser')
        .post(userController.createUser)

    app.route('/api/login')
        .post(userController.login)
        
    app.route('/verify')
        .get(userController.verifyToken)

    app.route('/api/getUser')
        .get(userController.verifyToken, userController.getUserInfo)
        .patch(userController.verifyToken, userController.updateUserInformation)

} 