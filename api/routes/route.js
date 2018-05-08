module.exports = function(app){
    var controller = require('../controllers/controller')

    app.route('/getuser')
        .get(controller.getUser)
    app.route('/create')
        .get(controller.createUser)
} 