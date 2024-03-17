const config = require('../sample-config')
const SimpleNodeLogger = require('simple-node-logger'),
logger = SimpleNodeLogger.createSimpleLogger( config.logger );

module.exports = logger
