'use strict';

const config = require('../sample-config');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;

axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: (error) => {
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});


exports.sendNotification = async (msg) => {
    const apiUrl = `https://api.telegram.org/bot${ config.telegramToken }/sendMessage?chat_id=${ config.telegramChatID }&text=`;
    const encodedMsg = encodeURIComponent(msg);
    // console.log('SENDING ADS----------------------')
    // console.log(`Message: ${ msg }`)
    // console.log(`encodedMsg: ${ encodedMsg }`)
    return await axios.get(apiUrl + encodedMsg, { timeout: 50000 }).catch((error) =>{
        console.log(error)
    });
};
