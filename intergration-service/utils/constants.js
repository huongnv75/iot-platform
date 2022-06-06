const config = require("../config/config");

module.exports = Object.freeze({
    //keycloak
    KEYCLOAK_ACCESS_TOKEN: '/realms/master/protocol/openid-connect/token',
    KEYCLOAK_USERS: '/admin/realms/master/users?briefRepresentation=true&first=0&max=' + config.app.pageSize,
    KEYCLOAK_USER_ROLE_MAPPINGS: '/admin/realms/master/users/userId/role-mappings/realm/composite',
    KEYCLOAK_GROUPS: '/admin/realms/master/groups?first=0&max=' + config.app.pageSize,
    KEYCLOAK_GROUP_ROLE_MAPPINGS: '/admin/realms/QLSX/groups/groupId/role-mappings/realm/composite',
    KEYCLOAK_GROUP_MEMBERS: '/admin/realms/QLSX/groups/groupId/members?first=0&max=' + config.app.pageSize,
    //scada
    SCADA_LOGIN: '/api/auth/login',
    SCADA_GET_CUSTOMERS: '/api/customers?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC',
    SCADA_CREATE_CUSTOMER: '/api/customer',
    SCADA_GET_USERS: '/api/customer/customerId/users?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC',
    SCADA_CREATE_AND_UPDATE_USER: '/api/user?sendActivationMail=false',
    SCADA_ACTIVE_USER: '/api/user/userId/activationLink',
    SCADA_DELETE_USER: '/api/user/userId',
    SCADA_TENANT_INFO: '/api/tenantInfos?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC&textSearch=defaultTenant',
    SCADA_DELETE_TENANT: '/api/tenant/tenantId',
    SCADA_ALL_DASHBOARDS: '/api/tenant/dashboards?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC',
    SCADA_CUSTOMER_DASHBOARDS: '/api/customer/customerId/dashboards?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC',
    SCADA_UPDATE_DASHBOARD: '/api/customer/customerId/dashboard/dashboardId',
    SCADA_OAUTH2: '/api/noauth/oauth2Clients?platform=WEB'
});