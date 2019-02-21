const garie_plugin = require('garie-plugin')
const path = require('path');
const config = require('../config');
const express = require('express');
const bodyParser = require('body-parser');
const serveIndex = require('serve-index');


function getResults(file) {
    var regex = RegExp("That's it. ([0-9]+) link[s]? in ([0-9]+) URL[s]? checked. ([0-9]+) warning[s]? found. ([0-9]+) error[s]? found.", 'g');

    var values = regex.exec(file);

    var links = parseInt(values[1]);
    var errors = parseInt(values[4]);
    var result = {};

    result['linksintegrity'] = 100 - (100 * errors / links);
    return result;
}

const myGetFile = async (options) => {
    options.fileName = 'linksintegrity.txt';
    const file = await garie_plugin.utils.helpers.getNewestFile(options);
    return getResults(file);
}

const myGetData = async (item) => {
    const { url } = item.url_settings;
    return new Promise(async (resolve, reject) => {
        try {
            var { recursion_depth } = item.url_settings;
            if (recursion_depth === undefined){
                recursion_depth = 1
            }
            const recursion_str = '-r ' + recursion_depth;

            const { reportDir } = item;

            const options = { script: path.join(__dirname, './my_script.sh'),
                        url: url,
                        reportDir: reportDir,
                        params: [ recursion_str ],
                        callback: myGetFile
                    }
            data = await garie_plugin.utils.helpers.executeScript(options);
            resolve(data);
        } catch (err) {
            console.log(`Failed to get data for ${url}`, err);
            reject(`Failed to get data for ${url}`);
        }
    });
};



console.log("Start");


const app = express();
app.use('/reports', express.static('reports'), serveIndex('reports', { icons: true }));

const main = async () => {
  garie_plugin.init({
    db_name:'linksintegrity',
    getData:myGetData,
    report_folder_name:'linksintegrity-results',
    plugin_name:"linksintegrity",
    app_root: path.join(__dirname, '..'),
    config:config
  });
}

if (process.env.ENV !== 'test') {
  app.listen(3000, async () => {
    console.log('Application listening on port 3000');
    await main();
  });
}
