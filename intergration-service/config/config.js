require('dotenv').config();
module.exports = {
    app: {
        port: process.env.APP_PORT || 3002,
        pageSize: process.env.APP_PAGE_SIZE || 100,
        cronJob: process.env.APP_CRONT_JOB || "* * * * * *"
    },
    keycloak: {
        baseUrl: process.env.KEYCLOAK_BASE_URL,
        realmName: process.env.KEYCLOAK_REALM_NAME,
        admin: process.env.KEYCLOAK_ADMIN,
        password: process.env.KEYCLOAK_PASSWORD
    },
    scada: {
        baseUrl: process.env.SCADA_BASE_URL,
        tenant: process.env.SCADA_TENANT,
        tenantPassword: process.env.SCADA_TENANT_PASSWORD,
        sysadmin: process.env.SCADA_SYSADMIN,
        sysadminPassword: process.env.SCADA_SYSADMIN_PASSWORD
    },
    database: {
        ip: process.env.SCADA_DATABASE_IP,
        port: process.env.SCADA_DATABASE_PORT,
        user: process.env.SCADA_DATABASE_USER,
        password: process.env.SCADA_DATABASE_PASSWORD,
        schemal: process.env.SCADA_DATABASE_SCHEMAL
    }
};