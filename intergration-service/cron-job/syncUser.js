const global = require("../utils/globalFunction");
const keycloak = require("../keycloak-apis");
const scada = require("../scada-apis");

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
                                                scada.getCustomerDashboards(scadaToken, customer.id).then(dashboards => {
                                                    let db = dashboards.find(obj => {
                                                        return obj.name == 'Giám sát';
                                                    });
                                                    if (db != undefined && db != null) {
                                                        scada.updateDefaultDashboardUser(scadaToken, user, db.id).then(rs => {

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
module.exports = { synchroUsersDatabase }