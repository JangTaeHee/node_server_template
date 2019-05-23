const oracledb = require('oracledb')
const {oraclePool} = require('./config.js')
const connectionKeys = Object.keys(oraclePool)

function openConnections() {
    return new Promise((resolve, reject) => {
        let promiseChain = Promise.resolve()

        connectionKeys.forEach(key => {
            promiseChain = promiseChain.then(() => {
                return oracledb.createPool({
                    user : oraclePool[key].user,
                    password : oraclePool[key].password,
                    connectString : oraclePool[key].connectString,
                    poolAlias : key,
                    poolMax : oraclePool[key].poolMax,
                    poolMin : oraclePool[key].poolMin,
                    poolIncrement : oraclePool[key].poolIncrement,
                    poolTimeout : oraclePool[key].poolTimeout
                })
            })
        })
        
        promiseChain
            .then(resolve)
            .catch(reject)
    })
}
module.exports.openConnections = openConnections

function closeConnections(){
    return new Promise((resolve, reject) => {
        let promiseChain = Promise.resolve()

        connectionKeys.forEach(key => {
            promiseChain = promiseChain.then(() => {
                return oracledb.getPool(key).close
            })
        })

        promiseChain
            .then(resolve)
            .catch(reject)
    })
}
module.exports.closeConnections = closeConnections

function simpleExcute(connection, statement, binds=[], opts={}){
    return new Promise((resolve, reject) => {
        let conn
        let err
        opts.outFormat = oracledb.OBJECT
        opts.autoCommit = true

        oracledb.getPool(connection).getConnection()
            .then(c => {
                conn = c

                return conn.execute(statement, binds, opts)
            })
            .then(r => {
                result = r;
            })
            .catch(e => {
                err = err || e
            })
            .then(() => {
                if(conn){
                    return conn.close()
                }
            })
            .catch(err => {
                err = err || e
            })
            .then(() => {
                if(err){
                    reject(err)
                    return
                }

                resolve(result)
            })
    })
}
module.exports.simpleExcute = simpleExcute