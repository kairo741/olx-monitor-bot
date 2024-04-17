require('dotenv').config()

let config = {}

config.urls = [
    'https://www.olx.com.br/brasil?q=nintendo%203ds&sf=1',
    'https://www.olx.com.br/brasil?q=nintendo%203ds%20xl&sf=1',
    'https://www.olx.com.br/brasil?q=pok%C3%A9mon%20ultra%20moon&sf=1',
    'https://www.olx.com.br/brasil?q=pok%C3%A9mon%20ultra%20sun&sf=1'
]

// this tool can help you create the interval string:
// https://tool.crontap.com/cronjob-debugger

config.interval = '*/5 * * * *' 
config.telegramChatID = process.env.TELEGRAM_CHAT_ID
config.telegramToken = process.env.TELEGRAM_TOKEN
config.dbFile = './data/ads.db'

config.logger={
    logFilePath: './data/scrapper.log',
    timestampFormat:'YYYY-MM-DD HH:mm:ss'
}

module.exports = config