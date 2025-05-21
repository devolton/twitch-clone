require('dotenv/config');

module.exports = {
    service: {
        endpoint: {
            url: process.env.CODEGEN_SERVER_URL,
            skipSSLValidation: true,
        }
    }
}