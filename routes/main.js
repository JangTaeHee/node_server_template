const express = require('express');
const async = require('async');
const { toXML } = require('jstoxml')
const mysql = require('../db/mysqlQuery');
const oracle = require('../db/oracleQuery');
const router = express.Router();
const logger = require('../logger/logger.js');

router.get('/', (req, res, next) => {
    const reqParams = req.params
    let reqQuerys = req.query

    const params = {}

    oracle.checkApiInfo(params)
	.then(rows => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(rows)
    })
	.catch(err => {
        const errObj = {
            error: error,
            message: error.message
        }
        returnErr(req, res, errObj)
	})
});

router.post('/', (req, res, next) => {
    const reqParams = req.params
    let reqQuerys = req.body

    const params = {}

    mysql.checkApiInfo(params, (error, rows) => {
        if(error){
            const errObj = {
                error: error,
                message: error.message
            }
            returnErr(req, res, errObj)
        }else{
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.json(rows)
        }
    })
});

// get client ip
const getUserIP = (req) => {
	var ipAddress;
	
    if(!!req.hasOwnProperty('sessionID')){
        ipAddress = req.headers['x-forwarded-for'];
    } else{
        if(!ipAddress){
            var forwardedIpsStr = req.header('x-forwarded-for');

            if(forwardedIpsStr){
				var forwardedIps = forwardedIpsStr.split(',');
                ipAddress = forwardedIps[0];
            }
            if(!ipAddress){
                ipAddress = req.connection.remoteAddress;
            }
        }
    }
    
    if (ipAddress.indexOf('::ffff:') != -1) {
    	ipAddress = ipAddress.substr(7)
	}
	
    return ipAddress;
}

const returnErr = (req, res, errObj) => {
	let returnObj = {INFO: {}}
	let error = errObj

	returnObj.INFO = error

	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	res.json(returnObj);

    // return xml
    // res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    // res.send(toXML(results))
}

module.exports = router;