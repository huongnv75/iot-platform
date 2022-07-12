const global = require("../utils/globalFunction");
const constants = require("../utils/constants");
const keycloak = require("../keycloak-apis");
const scada = require("../scada-apis");

function synchroDashboardsDatabase() {
    keycloak.getAccessToken().then(keycloakToken => {
        scada.getToken().then(scadaToken => {
            scada.getCustomers(scadaToken).then(scadaCustomers => {
                for (const customer of scadaCustomers) {
                    //với mỗi customer của scada thì xem nó trùng với group nào của keycloak rồi thực hiện cập nhật theo group đó
                    scada.getCustomerDashboards(scadaToken, customer.id).then(oldDashboards => {
                        keycloak.getGroups(keycloakToken).then(keycloakGroups => {
                            for (const group of keycloakGroups) {
                                //if (group.name == customer.name) {
                                if (group.name == "Check_12") {
                                        keycloak.getGroupRoleMappings(keycloakToken, group.id).then(roles => {
                                        scada.getAllDashboards(scadaToken).then(dashboards => {
                                            // kiểm tra xem trong những roles của keycloak, scada chưa có dashboard nào thì thêm vào
                                            for (const role of roles) {
                                                for (const dashboard of dashboards) {
                                                    if (constants.MAPS.get(role) == dashboard.name) {
                                                        scada.assignDashboard(scadaToken, customer.id, dashboard.id).then(rs => {
                                                        });
                                                    }
                                                }
                                            }
                                            //kiểm tra lại với dashboards cũ thì có những phần tử nào không có trong roles của keycloak thì xóa đi
                                            for (const element of oldDashboards) {
                                                if (!global.contain(roles, element.name, true)) {
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
module.exports = { synchroDashboardsDatabase }