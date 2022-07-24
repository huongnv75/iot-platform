const global = require("../utils/globalFunction");
const keycloak = require("../base/keycloak-apis");
const scada = require("../base/scada-apis");
const config = require("../config/config");

function synchroCustomerUsersDatabase() {
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
                                        scada.createCustomerUser(scadaToken, customer, email).then(u => {
                                            scada.activeUser(scadaToken, u).then(rs => {

                                            });
                                        })

                                    }
                                });

                            });
                        } else {
                            //customer đã có trên scada ==> cần cập nhật user của customer đó theo group của keycloak
                            // console.log('group name====>', group.name);
                            let match = scadaCustomers.find(obj => {
                                return obj.name == group.name;
                            });
                            scada.detailCustomer(scadaToken, match.id).then((customer) => {
                                scada.getCustomerUsers(scadaToken, customer.id.id).then(oldUsers => {
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
                                                scada.createCustomerUser(scadaToken, customer, email);
                                            } else {
                                                let user = oldUsers.find(obj => {
                                                    return obj.email == email;
                                                });
                                                if (user.additionalInfo.defaultDashboardId == null) {
                                                    scada.getCustomerDashboards(scadaToken, customer.id.id).then(dashboards => {
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
                                                //console.log('emailKeycloaks=====>', emailKeycloaks);
                                                //console.log('element.email=====>', element.email);
                                                // scada.deleteUser(scadaToken, element.id.id);
                                            }
                                        }
                                    })
                                })
                            })

                        }
                    }
                })
            })
        })
    });
}

function synchroTenantUsersDatabase() {
    keycloak.getAccessToken().then(keycloakToken => {
        scada.getToken(config.scada.sysadmin, config.scada.sysadminPassword).then(scadaToken => {
            scada.deleteGoogleTenant(scadaToken);
            scada.getTenantInfos(scadaToken, config.scada.tenantName).then(scadaTenants => {
                if (scadaTenants.length > 0) {
                    let scadaTenant = scadaTenants[0];
                    scada.getTenantUsers(scadaToken, scadaTenant.id.id).then(oldUsers => {
                        const oldEmails = oldUsers.map(function (a) { return a.email; });
                        keycloak.getGroups(keycloakToken).then(keycloakGroups => {
                            for (const group of keycloakGroups) {
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
                                            scada.createTenantUser(scadaToken, scadaTenant.id, email);
                                        } else {
                                            // let user = oldUsers.find(obj => {
                                            //     return obj.email == email;
                                            // });
                                            // if (user.additionalInfo.defaultDashboardId == null) {
                                            //     scada.getTenantDashboards(scadaToken, customer.id).then(dashboards => {
                                            //         let db = dashboards.find(obj => {
                                            //             return obj.name == 'Giám sát';
                                            //         });
                                            //         if (db != undefined && db != null) {
                                            //             scada.updateDefaultDashboardUser(scadaToken, user, db.id).then(rs => {

                                            //             });
                                            //         }
                                            //     })
                                            // }
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
                                            // console.log('emailKeycloaks=====>', emailKeycloaks);
                                            // console.log('element.email=====>', element.email);
                                            // scada.deleteUser(scadaToken, element.id.id);
                                        }
                                    }
                                })
                            }
                        })
                    })
                }
            })
        })
    });
}

function synchroUsersDatabase() {
    scada.getToken(config.scada.sysadmin, config.scada.sysadminPassword).then(scadaTokenSysAdmin => {
        scada.deleteGoogleTenant(scadaTokenSysAdmin);
        scada.getTenantInfos(scadaTokenSysAdmin, config.scada.tenantName).then(scadaTenants => {
            if (scadaTenants.length > 0) {
                let scadaTenant = scadaTenants[0];
                scada.getTenantUsers(scadaTokenSysAdmin, scadaTenant.id.id).then(oldUsers => {
                    const oldEmails = oldUsers.map(function (a) { return a.email; });
                    keycloak.getAccessToken().then(keycloakToken => {
                        scada.getToken().then(scadaToken => {
                            scada.getCustomers(scadaToken).then(scadaCustomers => {
                                keycloak.getGroups(keycloakToken).then(keycloakGroups => {
                                    const customerNames = scadaCustomers.map(function (a) { return a.name; });
                                    for (const group of keycloakGroups) {
                                        // check group nếu có quyền admin
                                        keycloak.getGroupRoleMappings(keycloakToken, group.id).then(roles => {
                                            if (roles.length > 0) {
                                                if (roles.includes('admin_scada') || roles.includes('manager_scada')) {
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
                                                                scada.createTenantUser(scadaTokenSysAdmin, scadaTenant.id, email);
                                                            } else {
                                                                // cập nhật user tenant đã tồn tại
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
                                                                // xóa user tenant
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    // tạo mới customer và user nếu như chưa có trên scada
                                                    if (!global.contain(customerNames, group.name)) {
                                                        scada.createCustomer(scadaToken, group.name).then(customer => {
                                                            keycloak.getGroupMembers(keycloakToken, group.id).then(keycloakMembers => {
                                                                for (const member of keycloakMembers) {
                                                                    let email = member.email;
                                                                    if (email == null || email == '') {
                                                                        email = member.username + '@gmail.com';
                                                                    }
                                                                    scada.createCustomerUser(scadaToken, customer, email).then(u => {
                                                                        scada.activeUser(scadaToken, u).then(rs => {

                                                                        });
                                                                    })

                                                                }
                                                            });

                                                        });
                                                    } else {
                                                        //customer đã có trên scada ==> cần cập nhật user của customer đó theo group của keycloak
                                                        let match = scadaCustomers.find(obj => {
                                                            return obj.name == group.name;
                                                        });
                                                        scada.detailCustomer(scadaToken, match.id).then((customer) => {
                                                            scada.getCustomerUsers(scadaToken, customer.id.id).then(oldUsers => {
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
                                                                            scada.createCustomerUser(scadaToken, customer, email);
                                                                        } else {
                                                                            let user = oldUsers.find(obj => {
                                                                                return obj.email == email;
                                                                            });
                                                                            if (user.additionalInfo.defaultDashboardId == null) {
                                                                                scada.getCustomerDashboards(scadaToken, customer.id.id).then(dashboards => {
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
                                                                            //xóa user
                                                                        }
                                                                    }
                                                                })
                                                            })
                                                        })

                                                    }
                                                }
                                            }
                                        });

                                    }
                                })
                            })
                        })
                    });
                })
            }
        })
    })
}

module.exports = { synchroCustomerUsersDatabase, synchroTenantUsersDatabase, synchroUsersDatabase }