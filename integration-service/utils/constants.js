const config = require("../config/config");
const maps = new Map();
// name role in keycloak -- name dashboard in scada
maps.set('Giám sát', 'Giám sát');
maps.set('Quản lý Nhóm Sản phẩm', 'Quản lý nhóm Sản phẩm');
maps.set('Quản lý Sản phẩm', 'Quản lý sản phẩm');
maps.set('Quản lý thiết bị IOT', 'Danh mục thiết bị');
maps.set('Quản lí công đoạn', 'Quản lí công đoạn');
maps.set('Quản lý nhóm lỗi', 'Quản lí nhóm lỗi');
maps.set('Khai báo lỗi', 'Quản lý và khai báo danh sách lỗi');
maps.set('Khai báo lỗi HMI', 'Quản lý và khai báo lỗi HMI');
maps.set('Khai báo lỗi cho lệnh sản xuất', 'Quản lý lỗi -WoLine');

module.exports = Object.freeze({
    //keycloak
    KEYCLOAK_ACCESS_TOKEN: '/realms/master/protocol/openid-connect/token',
    KEYCLOAK_USERS: '/admin/realms/master/users?briefRepresentation=true&first=0&max=' + config.app.pageSize,
    KEYCLOAK_USER_ROLE_MAPPINGS: '/admin/realms/master/users/userId/role-mappings/realm/composite',
    KEYCLOAK_GROUPS: '/admin/realms/master/groups?first=0&max=' + config.app.pageSize,
    KEYCLOAK_GROUP_ROLE_MAPPINGS: '/admin/realms/master/groups/groupId/role-mappings/realm/composite',
    KEYCLOAK_GROUP_MEMBERS: '/admin/realms/master/groups/groupId/members?first=0&max=' + config.app.pageSize,
    //scada
    SCADA_LOGIN: '/api/auth/login',
    SCADA_GET_CUSTOMERS: '/api/customers?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC',
    SCADA_CREATE_CUSTOMER: '/api/customer',
    SCADA_DETAIL_CUSTOMER: '/api/customer/customerId',
    SCADA_GET_CUSTOMER_USERS: '/api/customer/customerId/users?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC',
    SCADA_GET_TENANT_USERS: '/api/tenant/tenantId/users?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC',
    SCADA_CREATE_AND_UPDATE_USER: '/api/user?sendActivationMail=false',
    SCADA_ACTIVE_USER: '/api/user/userId/activationLink',
    SCADA_DELETE_USER: '/api/user/userId',
    SCADA_TENANT_INFO: '/api/tenantInfos?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC',
    SCADA_DELETE_TENANT: '/api/tenant/tenantId',
    SCADA_ALL_DASHBOARDS: '/api/tenant/dashboards?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC',
    SCADA_HOME_DASHBOARD: '/api/dashboard/home',
    SCADA_CUSTOMER_DASHBOARDS: '/api/customer/customerId/dashboards?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC',
    SCADA_TENANT_DASHBOARDS: '/api/tenant/tenantId/dashboards?pageSize=' + config.app.pageSize + '&page=0&sortProperty=createdTime&sortOrder=DESC',
    SCADA_UPDATE_DASHBOARD: '/api/customer/customerId/dashboard/dashboardId',

    SCADA_DETAIL_ASSET: '/api/asset/info/assetId',
    SCADA_GET_ASSETS: '/api/tenant/assetInfos?pageSize=_pageSize_&page=_page_&textSearch=_textSearch_&sortProperty=createdTime&sortOrder=DESC&type=_type_',
    SCADA_CREATE_AND_UPDATE_ASSET: '/api/asset',
    SCADA_DELETE_ASSET: '/api/asset/assetId',
    SCADA_GET_ASSET_ID_BY_NAME: '/api/tenant/assetInfos?pageSize=' + config.app.pageSize + '&page=0&textSearch=name&sortProperty=createdTime&sortOrder=DESC&type=',
    SCADA_GET_ASSET_ATTRIBUTES_BY_ID: '/api/plugins/telemetry/ASSET/assetId/values/attributes/SERVER_SCOPE',
    SCADA_OAUTH2: '/api/noauth/oauth2Clients?platform=WEB',
    //others
    MAPS:maps
});