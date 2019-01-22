const fs = require('fs');
const path = require('path');
const flatten = require('flat');
const child_process = require('child_process');
const logger = require('../utils/logger');

const urlParser = require('url');
const crypto = require('crypto');
const isEmpty = require('lodash.isempty');


function pathNameFromUrl(url) {
  const parsedUrl = urlParser.parse(url),
    pathSegments = parsedUrl.pathname.split('/');

  pathSegments.unshift(parsedUrl.hostname);

  if (!isEmpty(parsedUrl.search)) {
    const md5 = crypto.createHash('md5'),
      hash = md5
        .update(parsedUrl.search)
        .digest('hex')
        .substring(0, 8);
    pathSegments.push('query-' + hash);
  }
  return pathSegments.filter(Boolean).join('-');
}

function reportDir(url) {
    return path.join(__dirname, '../../reports/linksintegrity-results', pathNameFromUrl(url));
}

function getResults(file) {

    var regex = RegExp("That's it. ([0-9]+) link[s]? in ([0-9]+) URL[s]? checked. ([0-9]+) warning[s]? found. ([0-9]+) error[s]? found.", 'g');

    var values = regex.exec(file);

    var links = parseInt(values[1]);
    var errors = parseInt(values[4]);
    var result = {};

    result['linksintegrity'] = 100 - (100 * errors / links);
    return result;
}

const getLinksIntegrityFile = (url = '') => {
    try {
        const dir = path.join(__dirname, '../../reports/linksintegrity-results', pathNameFromUrl(url));

        const folders = fs.readdirSync(dir);

        const newestFolder = folders[folders.length - 1];

        const linksIntegrityFile = fs.readFileSync(path.join(dir, newestFolder, 'linksintegrity.txt'));

        return Promise.resolve(getResults(linksIntegrityFile));
    } catch (err) {
        console.log(err);
        const message = `Failed to get linksintegrity file for ${url}`;
        logger.warn(message);
        return Promise.reject(message);
    }
};

const getData = async (url, recursion_depth = 1) => {
    return new Promise(async (resolve, reject) => {

        try {
            const recursion_str = '-r ' + recursion_depth;
            const child = child_process.spawn('bash', [path.join(__dirname, './linkchecker.sh'), url, reportDir(url), recursion_str]);

            child.on('exit', async () => {
                logger.info(`Finished getting data for ${url}, trying to get the results`);
                const data = await getLinksIntegrityFile(url);
                resolve(data);
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
    getData,
    getResults
};
