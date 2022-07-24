//Config
const config = require("./config/config");
const global = require("./utils/globalFunction");
const cronJobFunction = require("./cron-job");
const log = global.getLogger(module);

const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
var cors = require('cors')
const pgtools = require("pgtools");

const db = require("./integration/db");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

const cron = require('node-cron');
const scada = require('./base/scada-apis');
const keycloak = require('./base/keycloak-apis');
const publics = require('./public-apis');

// cronjob đồng bộ dữ liệu từ Keycloak sang Scada
if (config.app.enableCronJob) {
    console.log('aaaaa')
    // cron.schedule(config.app.cronJob, () => {
    //     cronJobFunction.synchroUsersDatabase();
    //     // cronJobFunction.synchroCustomerUsersDatabase();
    //     // cronJobFunction.synchroTenantUsersDatabase();
    //     cronJobFunction.synchroDashboardsDatabase();
    //     cronJobFunction.deleteLogDatabase();
    // });
}
//intergration apis là bổ sung các api cho các bảng mới
if (config.app.enableIntegrationApis) {
    pgtools.createdb(config.database, config.database.schemal, function (error) {
        if (error) {
            log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.message);
        }
        db.sequelize.sync().then(() => {
            app.use('/api', require('./integration/apis'));
        }).catch((error) => {
            log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response?.data?.message);
        });
    });
}
//resources cho các plugin add vào thư viện
app.use('/resources', express.static(path.join(__dirname, 'resources')));

//wrapperApis cho các API được wrapper tài khoản tenant từ scada hoặc admin của keycloak
app.use('/wrapperApis', require('./wrapper-apis'));

//publicApis cho các API được public dùng cho scada
app.use('/publicApis', require('./public-apis'));

//IP-SERVER:IP-PORT là redirect tới Oauth2 của scada
app.get('/', (req, res) => {
    scada.redirectOauth2().then(data => {
        res.redirect(config.scada.baseUrl + data[0]?.url);
    }).catch((error) => { res.status(400).send(error); });
});
app.get('/xxx/:assetId/:xxx', (req, res) => {
    res.status(200).send(req.params);
});
app.get('/yyy', (req, res) => {
    res.status(200).send(req.query);
});
app.listen(config.app.port, () => {
    log.info('###App running on port ' + config.app.port);
});
//test
// let x = global.yamlToJson(path.join(__dirname, 'test.yaml'));
// console.log(x);
// x.others[0].name = "blue";
// x.others2.name = "xxxx";
// global.jsonToYaml(x, path.join(__dirname, 'test2.yaml'));
