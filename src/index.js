const garie_plugin = require('garie-plugin')
const child_process = require('child_process');
const path = require('path');


function getResults(file) {

    var regex = RegExp("That's it. ([0-9]+) link[s]? in ([0-9]+) URL[s]? checked. ([0-9]+) warning[s]? found. ([0-9]+) error[s]? found.", 'g');

    var values = regex.exec(file);

    var links = parseInt(values[1]);
    var errors = parseInt(values[4]);
    var result = {};

    result['linksintegrity'] = 100 - (100 * errors / links);
    return result;
}

const getData = async (options) => {
    const { url } = options.url_settings;
    return new Promise(async (resolve, reject) => {

        try {
            var { recursion_depth } = options.url_settings;
            const { reportDir } = options;
            if (recursion_depth === undefined){
                recursion_depth = 1
            }
            const recursion_str = '-r ' + recursion_depth;
            const child = child_process.spawn('bash', [path.join(__dirname, './linkchecker.sh'), url, reportDir, recursion_str]);

            const 

            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
        } catch (err) {
            console.log(`Failed to get data for ${url}`, err);
            reject(`Failed to get data for ${url}`);
        }
    });
};


garie_plugin.init({getData:getData, getResults: getResults, app_name:'linksintegrity', app_root: path.join(__dirname, '..'), config:{"cron": "0 */4 * * *",urls:[{url:"https://www.eea.europa.eu", recursion_depth:"0"}]}});