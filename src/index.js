const config = require("./sample-config")
const cron = require("node-cron")
const { initializeCycleTLS } = require("./components/CycleTls")
const $logger = require("./components/Logger")
const { scraper } = require("./components/Scraper")
const { createTables } = require("./database/database.js")

const runScraper = async () => {
  for (let i = 0; i < config.urls.length; i++) {
    try {
      console.log(`%c ${new Date().toLocaleString()} | Buscando... Url: ${config.urls[i]}`, 'background: #222; color: #bada55');
      scraper(config.urls[i])
    } catch (error) {
      $logger.error(error)
    }
  }
}

const main = async () => {
  $logger.info("Program started")
  await createTables()
  await initializeCycleTLS()
  runScraper()
}

main()

cron.schedule(config.interval, () => {
  // console.log("Buscando...")
  runScraper()
})
