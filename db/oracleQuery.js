const pool = require("../db/oraclePool");
const connectionName = 'clmns'

exports.checkApiInfo = (params) => {
    let query = `
    SELECT
        API_KEY
    FROM API_INFO
    `

    const bind = Object.values(params)

    //bind.pop() // 불필요 bind 요소 제거

    return new Promise((resolve, reject) => {
        pool.simpleExcute(connectionName, query, bind)
        .then(result => resolve(result.rows))
        .catch(reject)
    })
}