/* Node server REST API config file */

// Container for all enviroments
const enviroments = {};

// Default staging env
enviroments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging'
};

// Production env
enviroments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production'
};

// Determine the called enviroment
const currentEnviroment = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase() : '';

// Check fot hte chosen enviroment
const enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

// Export the module
module.exports = enviromentToExport;
