//Config
const config = require("./config/config");
const global = require("./utils/globalFunction");
const cronJobFunction = require("./cron-job");
const apis = require("./apis");
const log = global.getLogger(module);
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const db = require("./db");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const cron = require('node-cron');

cron.schedule(config.app.cronJob, () => {
    try {
        // cronJobFunction.synchroUsersDatabase();
        // cronJobFunction.synchroDashboardsDatabase();
    } catch (error) {
        log.error('cron error: ' + error.message);
    }
});

//resources cho các plugin add vào thư viện
app.use('/resources', express.static(path.join(__dirname, 'resources')));

//IP-SERVER:IP-PORT là redirect tới Oauth2 của hệ thống
app.get('/', (req, res) => {
    scada.redirectOauth2().then(data => {
        res.redirect(config.scada.baseUrl + data[0].url);
    })
});

//intergration apis
db.sequelize.sync();
app.use('/api', require('./apis'));

app.listen(config.app.port, () => {
    log.info('App running on port ' + config.app.port);
});