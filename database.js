const mysql = require('mysql')

class Database {
    constructor() {
        let self = this

        global.pool.getConnection(function(error, connection) {
            if (error) reject(error)
            
            self.connection = connection
        })
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (error, result) => {
                if (error) return reject(error);
                
                resolve(result);
            } );
        } );
    }
    release() {
        return new Promise((resolve, reject) => {
            this.connection.release(error => {
                if (error) return reject(error);
                
                resolve();
            } );
        } );
    }
}

module.exports = new Database()