const garie_plugin = require('garie-plugin')

function getData_complex(url, options){
//    console.log(url, options)
//return {'v1':1, 'v2':22};
        return {js_events:2, server_events:3, nb_visits:10}
}

function getData_simple(url, options){
    return {'v1':1, 'v2':22};
}

function getMeasurement_complex(url, data){
    measurement = []
    measurement.push({
        measurement: 'JsEvents/TotalVisits',
        tags:  url ,
        fields: { value: data.js_events / data.nb_visits * 100, total_visits: data.nb_visits, sentry_events: data.js_events }
    });
    measurement.push({
        measurement: 'ServerEvents/TotalVisits',
        tags:  url ,
        fields: { value: data.server_events / data.nb_visits * 100, total_visits: data.nb_visits, sentry_events: data.server_events }
    });

    return measurement;

}

garie_plugin.init({getData:getData_simple,config:{"cron": "0 */4 * * *",urls:[{url:"www.test.com"}]}});

garie_plugin.init({getData:getData_complex, getMeasurement:getMeasurement_complex, config:{"cron": "0 */4 * * *",urls:[{url:"www.test1.com"}]}});