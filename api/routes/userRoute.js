module.exports = function(app){
    var userController = require('../controllers/userController')
    
    app.route('/api/getAllUser')
        .get(userController.getUser)
        
    app.route('/api/createdUser')
        .post(userController.createUser)

    app.route('/api/login')
        .post(userController.login)
        

} 