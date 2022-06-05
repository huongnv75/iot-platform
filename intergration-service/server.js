//Config
const config = require("./config/config");
const global = require("./utils/globalFunction");
const cronJobFunction = require("./cron-job");
const log = global.getLogger(module);

const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
var cors = require('cors')

const db = require("./db");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

const cron = require('node-cron');
const scada = require('./scada-apis');

cron.schedule(config.app.cronJob, () => {
    cronJobFunction.synchroUsersDatabase();
    cronJobFunction.synchroDashboardsDatabase();
    cronJobFunction.test();
});

//resources cho các plugin add vào thư viện
app.use('/resources', express.static(path.join(__dirname, 'resources')));

//IP-SERVER:IP-PORT là redirect tới Oauth2 của hệ thống
app.get('/', (req, res) => {
    scada.redirectOauth2().then(data => {
        res.redirect(config.scada.baseUrl + data[0]?.url);
    })
});

//intergration apis là bổ sung các api cho các bảng mới
db.sequelize.sync().then(() => {
    app.use('/api', require('./integration-apis'));
});

app.listen(config.app.port, () => {
    log.info('App running on port ' + config.app.port);
});