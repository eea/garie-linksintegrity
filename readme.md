# Garie linksintegrity plugin

<p align="center">
  <p align="center">Tool to gather linkchecker metrics and supports CRON jobs.<p>
</p>

**Highlights**

-   Poll for [linkchecker](https://github.com/linkchecker/linkchecker) statistics on any website and stores the data into InfluxDB
-   View all historic linkchecker reports.
-   Setup within minutes

## Overview of garie-linksintegrity

Garie-linksintegrity was developed as a plugin for the [Garie](https://github.com/boyney123/garie) Architecture.

[Garie](https://github.com/boyney123/garie) is an out the box web performance toolkit, and `garie-linksintegrity` is a plugin that generates and stores [linkchecker](https://github.com/linkchecker/linkchecker) data into `InfluxDB`.

`Garie-linksintegrity` can also be run outside the `Garie` environment and run as standalone.

If your interested in an out the box solution that supports multiple performance tools like `lighthouse`, `google-speed-insight` and `web-page-test` then checkout [Garie](https://github.com/boyney123/garie).

If you want to run `garie-linksintegrity` standalone you can find out how below.

## Getting Started

### Prerequisites

-   Docker installed

### Running garie-linksintegrity

You can get setup with the basics in a few minutes.

First clone the repo.

```sh
git clone https://github.com/eea/garie-linksintegrity.git
```

Next setup you're config. Edit the `config.json` and add websites to the list.

```javascript
{
  "plugins":{
        "linksintegrity":{
            "cron": "0 */4 * * *"
        }
    },
  "urls": [
    {
      "url": "https://www.eea.europa.eu/",
      "plugins": {
        "linksintegrity":{
            "recursion_depth":1
        }
      }
    },
    {
      "url": "https://biodiversity.europa.eu/",
      "plugins": {
        "linksintegrity":{
            "recursion_depth":1
        }
      }
    }
  ]
}
```

Once you finished edited your config, lets setup our environment.

```sh
docker-compose up
```

This will run the application.

On start garie-linkchecker will start to gather statistics for the websites added to the `config.json`.


## config.json

| Property | Type                | Description                                                                          |
| -------- | ------------------- | ------------------------------------------------------------------------------------ |
| `plugins.linksintegrity.cron`   | `string` (optional) | Cron timer. Supports syntax can be found [here].(https://www.npmjs.com/package/cron) |
| `plugins.linksintegrity.retry`   | `object` (optional) | Configuration how to retry the failed tasks |
| `plugins.linksintegrity.retry.after`   | `number` (optional, default 30) | Minutes before we retry to execute the tasks |
| `plugins.linksintegrity.retry.times`   | `number` (optional, default 3) | How many time to retry to execute the failed tasks |
| `plugins.linksintegrity.retry.timeRange`   | `number` (optional, default 360) | Period in minutes to be checked in influx, to know if a task failed |
| `urls`   | `object` (required) | Config for linksintegrity. More detail below                                         |


MAX_AGE_OF_REPORT_FILES - int (default to 365), Maximum age (in days) of report files that can be deleted.
MAX_AGE_OF_REPORT_VIDEOS - int (default to 100), Maximum age (in days) of report videos that can be deleted.
CRON_DELETE_OLD_REPORTS - cronjob (default to '0 5 * * *') The frequency of checking old report files / videos.


**urls object**

| Property                                | Type                 | Description                                               |
| --------------------------------------- | -------------------- | --------------------------------------------------------- |
| `url`                                   | `string` (required)  | Url to get linksintegrity statistics for.                 |
| `plugins`                               | `object` (optional)  | To setup custom configurations.                           |
| `plugins.linksintegrity`                | `object` (required)  | To setup custom lighthouse config.                        |
| `plugins.linksintegrity.recursion_depth`| `number` (optional)  | If not set, the default 1 will be used.                   |

For more information please go to the [garie-plugin](https://github.com/eea/garie-plugin) repo.

