const http = require('http')
const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const logger = require('./logger/logger.js')

const infoRouter = require('./routes/main')

let app
let httpServer

function start() {
    return new Promise((resolve, reject) => {
      let port = process.env.HTTP_PORT || 3000

      app = express()
      httpServer = http.Server(app)

      // Combines logging info from request and response
      app.use(morgan('combined', { stream: logger.stream }));

      // Will parse incomming JSON requests and revice ISO 8601 date strings to
      // instances of Date
      app.use(bodyParser.json())

      // Enable CORS since we want to allow the API to be consumed by domains
      // other than the one the API is hosted from.
      app.use(enableCORS)

      // Mount the router at path so all routes start with path
      app.use('/main', infoRouter);
      app.use('/*',() => {});

      // Add an Scheduler
      const mysqlCheckScheduler = require('./schedule/mysql_check')
      const oracleCheckScheduler = require('./schedule/oracle_check')

      // Mount the unexpected error hander last
      app.use(handleUnexpectedError)

      // Add an event handler to the connection event of the http server
      // to track open http connections.
      httpServer.on('connection', trackConnection)

      httpServer.listen(port, (err) => {
        if(err){
          reject(err)
          return
        }

        console.log('Web Server listening on localhost:' + port)

        resolve()
      })
    })
}

module.exports.start = start

const dateTimeRegExp = '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3}?Z$/'

function reviveDates(key, value) {
  if(typeof value === 'string' && dateTimeRegExp.test(value)) {
    return new Date(value)
  }else{
    return value
  }
}

function enableCORS(req, res, next){
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  next()
}

function handleUnexpectedError(err, req, res, next) {
  console.log('An unexpeded error occured', err)

  res.status(500).send({message: 'An error has occurred, please contact support if the error'})
}

const openHttpConnection = {}

function trackConnection(conn) {
  const key = conn.remoteAddress + ':' + (conn.remotePort || '')

  openHttpConnection[key] = conn;

  conn.on('close', () => {
    delete openHttpConnection[key]
  })
}

function stop() {
  return new Promise((resolve, reject) => {
    let key

    for(key in openHttpConnection) {
      openHttpConnection[key].destroy()
    }
  })
}

module.exports.stop = stop