const fs = require('fs');
const path = require('path');
const flatten = require('flat');
const child_process = require('child_process');

const logger = require('../utils/logger');

const filterLinksIntegrityData = (report = {}) => {
    const { statistics = {} } = report;
    return flatten(statistics);
};

const getLinksIntegrityFile = (url = '') => {
    try {
        const urlWithNoProtocol = url.replace(/^https?\:\/\//i, '');

        const dir = path.join(__dirname, '../../reports/linksintegrity-results', urlWithNoProtocol);

        const folders = fs.readdirSync(dir);

        const sortFoldersByTime = folders.sort(function(a, b) {
            return new Date(b) - new Date(a);
        });

        const newestFolder = sortFoldersByTime[sortFoldersByTime.length - 1];

        const linksIntegrityFile = fs.readFileSync(path.join(dir, newestFolder, 'linksintegrity.dump'));

        return Promise.resolve(JSON.parse(linksIntegrityFile));
    } catch (err) {
        console.log(err);
        const message = `Failed to get linksintegrity file for ${url}`;
        logger.warn(message);
        return Promise.reject(message);
    }
};

const getData = async url => {
    return new Promise(async (resolve, reject) => {
        try {
            const child = child_process.spawn('bash', [path.join(__dirname, './linksintegrity.sh'), url]);

            child.on('exit', async () => {
                logger.info(`Finished getting data for ${url}, trying to get the results`);
                const data = await getLinksIntegrityFile(url);
                resolve(filterLinksIntegrityData(data));
            });

            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
        } catch (err) {
            logger.warn(`Failed to get data for ${url}`, err);
            reject(`Failed to get data for ${url}`);
        }
    });
};

module.exports = {
    getLinksIntegrityFile,
    filterLinksIntegrityData,
    getData
};
