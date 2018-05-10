module.exports = function(app){
    var userController = require('../controllers/userController')
    
    app.route('/api/getAllUser')
        .get(userController.getAllUser)
        
    app.route('/api/login')
        .post(userController.login)

    app.route('/api/user')
        .get(userController.verifyToken, userController.getUserInfo)
        .post(userController.createUser)
        .patch(userController.verifyToken, userController.updateUserInformation)

} 