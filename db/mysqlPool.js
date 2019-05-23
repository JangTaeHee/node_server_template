// 1. 모듈 추가
const genericPool = require('generic-pool')
const mysql = require('mysql')
const config = require('./config.js')

// 2. 풀링 생성
const factory = {
    create: function() {
        const connection = mysql.createConnection(config.mysqlPool)
        // 연결 작업 (비동기적인 접속 여부는 풀링에 맡김)
        connection.connect()
        // 연결 객체 반납
        return connection;
    },
    // 연결 종료
    destroy: function(client) {
        client.end();
    }
};
 
// 기본 연결수 설정  
const opts = { 
    max: 20, // maximum size of the pool
    min: 5 // minimum size of the pool
};
   
const mysqlPool = genericPool.createPool(factory, opts);

// 3. 풀링 해제
// 노드 종료시 호출되는 이벤트 내부에서 처리
process.on('beforeExit', (code) => {
	mysqlPool.drain().then(function() {
		mysqlPool.clear();
    });
});
// 오류 발생시 -> 1, try catch 2. 예외를 한곳에서 관리
process.on('uncaughtException', (err) => {
    console.log('예외발생', err);
});

// 4. 모듈화
module.exports = mysqlPool