//Config
const config = require("./config/config");
const global = require("./utils/globalFunction");
const keycloak = require("./apis/keycloak");
const scada = require("./apis/scada");
const log = global.getLogger(module);
const app = require('express')();

const cron = require('node-cron');

cron.schedule(config.app.cronJob, () => {
    log.info('running a task every second: ' + new Date());
    synchroUsersDatabase();
    synchroDashboardsDatabase();
});

synchroUsersDatabase();
function synchroUsersDatabase() {
    scada.deleteGoogleTenant();
    keycloak.getAccessToken().then(keycloakToken => {
        scada.getToken().then(scadaToken => {
            scada.getCustomers(scadaToken).then(scadaCustomers => {
                keycloak.getGroups(keycloakToken).then(keycloakGroups => {
                    const customerNames = scadaCustomers.map(function (a) { return a.name; });
                    for (const group of keycloakGroups) {
                        // tạo mới customer và user nếu như chưa có trên scada
                        if (!global.contain(customerNames, group.name)) {
                            scada.createCustomer(scadaToken, group.name).then(customer => {
                                keycloak.getGroupMembers(keycloakToken, group.id).then(keycloakMembers => {
                                    for (const member of keycloakMembers) {
                                        let email = member.email;
                                        if (email == null || email == '') {
                                            email = member.username + '@gmail.com';
                                        }
                                        scada.createUser(scadaToken, customer, email).then(u => {
                                            scada.activeUser(scadaToken, u).then(rs => {

                                            });
                                        })

                                    }
                                });

                            });
                        } else {
                            //customer đã có trên scada ==> cần cập nhật user của customer đó theo group của keycloak
                            // console.log('group name====>', group.name);
                            let customer = scadaCustomers.find(obj => {
                                return obj.name == group.name;
                            });
                            scada.getUsers(scadaToken, customer.id).then(oldUsers => {
                                const oldEmails = oldUsers.map(function (a) { return a.email; });
                                keycloak.getGroupMembers(keycloakToken, group.id).then(keycloakUsers => {
                                    let email = null;
                                    // kiểm tra xem trong keycloak có user nào thêm mà scada chưa thêm thì thêm
                                    // user nào đã có mà chưa cập nhật dashboard default thì cập nhật
                                    for (const user of keycloakUsers) {
                                        email = user.email;
                                        if (email == null || email == '') {
                                            email = user.username + '@gmail.com';
                                        }
                                        if (!global.contain(oldEmails, email)) {
                                            scada.createUser(scadaToken, customer, email);
                                        } else {
                                            let user = oldUsers.find(obj => {
                                                return obj.email == email;
                                            });
                                            if (user.additionalInfo.defaultDashboardId == null) {
                                                scada.getCustomerDashboards(scadaToken,customer.id).then(dashboards =>{
                                                    let db = dashboards.find(obj => {
                                                        return obj.name == 'Giám sát';
                                                    });
                                                    if(db != undefined && db !=null){
                                                        scada.updateDefaultDashboardUser(scadaToken, user, db.id).then(rs=>{

                                                        });
                                                    }
                                                })
                                            }
                                        }
                                    }
                                    // kiểm tra trong user cũ của scada có user nào chưa xóa thì xóa
                                    const emailKeycloaks = keycloakUsers.map(function (a) {
                                        let email = a.email;
                                        if (email == null || email == '') email = a.username + 'gmail.com';
                                        return email;
                                    });
                                    for (const element of oldUsers) {
                                        if (!global.contain(emailKeycloaks, element.email)) {
                                            console.log('emailKeycloaks=====>', emailKeycloaks);
                                            console.log('element.email=====>', element.email);
                                            // scada.deleteUser(scadaToken, element.id.id);
                                        }

                                    }

                                })

                            })

                        }
                    }
                })
            })
        })
    });
}

function synchroDashboardsDatabase() {
    keycloak.getAccessToken().then(keycloakToken => {
        scada.getToken().then(scadaToken => {
            scada.getCustomers(scadaToken).then(scadaCustomers => {
                for (const customer of scadaCustomers) {
                    //với mỗi customer của scada thì xem nó trùng với group nào của keycloak rồi thực hiện cập nhật theo group đó
                    scada.getCustomerDashboards(scadaToken, customer.id).then(oldDashboards => {
                        keycloak.getGroups(keycloakToken).then(keycloakGroups => {
                            for (const group of keycloakGroups) {
                                if (group.name == customer.name) {
                                    keycloak.getGroupRoleMappings(keycloakToken, group.id).then(roles => {
                                        scada.getAllDashboards(scadaToken).then(dashboards => {
                                            // kiểm tra xem trong những roles của keycloak, scada chưa có dashboard nào thì thêm vào
                                            for (const role of roles) {
                                                for (const dashboard of dashboards) {
                                                    if (role == dashboard.name) {
                                                        scada.assignDashboard(scadaToken, customer.id, dashboard.id).then(rs => {
                                                        });
                                                    }
                                                }
                                            }
                                            //kiểm tra lại với dashboards cũ thì có những phần tử nào không có trong roles của keycloak thì xóa đi
                                            for (const element of oldDashboards) {
                                                if (!global.contain(roles, element.name)) {
                                                    scada.unAssignDashboard(scadaToken, customer.id, element.id).then(rs => {
                                                    });
                                                }
                                            }
                                        })
                                    });
                                }
                            }
                        })
                    })
                }
            })
        })
    });
}

app.get('/', (req, res) => {
    scada.redirectOauth2().then(data => {
        res.redirect(config.scada.baseUrl + data[0].url);
    })
});

app.listen(config.app.port, () => {
    log.info('App running on port ' + config.app.port);
});