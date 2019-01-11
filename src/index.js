const CronJob = require('cron').CronJob;
const express = require('express');
const bodyParser = require('body-parser');
const serveIndex = require('serve-index');

const collect = require('./routes/collect');
const logger = require('./utils/logger');
const config = require('../config');

const { init, saveData } = require('./influx');

const { getData } = require('./linksintegrity');

const app = express();
app.use(bodyParser.json());

const { urls, cron } = config;

app.use('/collect', collect);
app.use('/reports', express.static('reports'), serveIndex('reports', { icons: true }));

const getDataForAllUrls = async () => {
    for (const item of urls) {
        const { url } = item;
        const { recursion_depth } = item;
        try {
            const data = await getData(url, recursion_depth);
            await saveData(url, data);
        } catch (err) {
            logger.error(`Failed to parse ${url}`, err);
        }
    }
};

const main = async () => {
    await init();

    try {
        if (cron) {
            return new CronJob(
                cron,
                async () => {
                    getDataForAllUrls();
                },
                null,
                true,
                'Europe/London',
                null,
                true
            );
        }
    } catch (err) {
        console.log(err);
    }
};

if (process.env.ENV !== 'test') {
    app.listen(3000, async () => {
        console.log('Application listening on port 3000');
        await main();
    });
}

module.exports = {
    main,
    app
};
