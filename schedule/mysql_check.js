const cron = require('node-schedule')
const mysql = require('../db/mysqlQuery')
const logger = require('../logger/logger')

cron.scheduleJob('0 */5 * * * *', function(){
	const params = {}

	mysql.checkApiInfo(params, (err, rows) => {
		if(err){
			const errObj = {
				error: err,
				message: err.message
			}
			logger.error(errObj)
			logger.error('------------------ AWS Aurora RDS Access Error ------------------')
		}
	})
})