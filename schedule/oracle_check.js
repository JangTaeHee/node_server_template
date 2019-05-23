const cron = require('node-schedule')
const oracle = require('../db/oracleQuery')
const logger = require('../logger/logger')

cron.scheduleJob('0 */5 * * * *', function(){
	const params = {}

	oracle.checkApiInfo(params)
	.then(rows => {})
	.catch(err => {
		const errObj = {
			error: err,
			message: err.message
		}
		logger.error(errObj)
		logger.error('------------------ AWS Oracle RDS Access Error ------------------')
	})
})