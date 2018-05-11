module.exports = function(app){
    var userController = require('../controllers/userController')
    
    app.route('/api/createUser')
        .post(userController.createUser)
        
    app.route('/api/login')
        .post(userController.login)

    app.route('/api/user')
        .get(userController.verifyToken, userController.getUserInfo)
        .post(userController.verifyToken, userController.updateUserInformation)

    app.route('/api/uploaduserimage')
        .post(userController.uploadUserImage)

} 