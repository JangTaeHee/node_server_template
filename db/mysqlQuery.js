const pool = require('./mysqlPool')

exports.checkApiInfo = (params, cb) => {
    const bind = Object.values(params)
    const query = `
    SELECT
        API_KEY
    FROM API_INFO
    `

    //bind.pop() // 불필요 bind 요소 제거

    const resourcePromise = pool.acquire()
    resourcePromise
        .then(function (client) {
            // 쿼리수행
            client.query(query, bind, (err, rows, fields) => {
                if(err) cb(err, []);
                else{
                    // 콜백 리턴
                    cb(err, rows);
    
                    // 커넥션을 풀링에게 반납, 가장 마지막 단계에서
                    pool.release(client)
                }
            })
        })
        .catch(function (err) {
            // handle error - this is generally a timeout or maxWaitingClients
            // error
            cb(err, {})
        });
}