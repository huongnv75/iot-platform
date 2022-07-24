const scada = require('../../base/scada-apis');
const keycloak = require('../../base/keycloak-apis');
function getRoles(username) {
    return new Promise(function (resolve, reject) {
        keycloak.getAccessToken().then((token) => {
            keycloak.getUsers(token, username).then((data) => {
                if (data.length > 0) {
                    let userId = data[0].id;
                    keycloak.getUserRoleMappings(token, userId).then((roles) => {
                        scada.getToken().then((scadaToken) => {
                            scada.getHomeDashboard(scadaToken).then((homeDashboard) => {
                                if (homeDashboard) {
                                    let widgets = homeDashboard.configuration.widgets;
                                    let states = homeDashboard.configuration.states.default.layouts.main.widgets;
                                    let filterWidgets = {};
                                    let filterStates = {};
                                    let arrayFilterIndex = [];
                                    let arrayStates = [];
                                    if (roles.includes('manager_scada')) {
                                        for (let key in widgets) {
                                            let item = widgets[key];
                                            arrayStates.push(states[key]);
                                            filterWidgets[key] = item;
                                            arrayFilterIndex.push(key);
                                        }
                                    } else {
                                        for (let key in widgets) {
                                            let item = widgets[key];
                                            arrayStates.push(states[key]);
                                            if (roles.indexOf(item.config.settings.name) >= 0) {
                                                filterWidgets[key] = item;
                                                arrayFilterIndex.push(key);
                                            }
                                        }
                                    }
                                    for (var ịndex = 0; ịndex < arrayFilterIndex.length; ịndex++) {
                                        filterStates[arrayFilterIndex[ịndex]] = arrayStates[ịndex];
                                    }
                                    homeDashboard.configuration.widgets = filterWidgets;
                                    homeDashboard.configuration.states.default.layouts.main.widgets = filterStates;
                                    homeDashboard.roles = roles;
                                    resolve(homeDashboard);
                                } else {
                                    let homeDashboard = {};
                                    homeDashboard.roles = roles;
                                    resolve(homeDashboard);
                                }

                            })
                        })
                    })
                } else {
                    let homeDashboard = {};
                    homeDashboard.roles = [];
                    resolve(homeDashboard);
                }
            })
        })
    });
}

module.exports = { getRoles };