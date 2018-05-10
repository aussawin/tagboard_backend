const mysql = require('mysql')

class Database {
    constructor() {
        let self = this

        global.pool.getConnection(function(error, connection) {
            if (error) reject(error)
            
            self.connection = connection
        })
    }
    query(sql, args, connection) {
        return new Promise((resolve, reject) => {
            connection.query(sql, args, (error, result) => {
                if (error) return reject(error);
                
                resolve(result);
            } );
        } );
    }
    release(connection) {
        return new Promise((resolve, reject) => {
            connection.release(error => {
                if (error) return reject(error);
                
                resolve();
            } );
        } );
    }
    getConnection() {
        return new Promise((resolve, reject) => {
            global.pool.getConnection(function(error, connection) {
                if (error) reject(error)
                
                resolve(connection)
            })
        })
    }
}

module.exports = new Database()