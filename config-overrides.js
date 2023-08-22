module.exports = function override(config, env) {
    if (env === 'development') {
        config.devtool = false; // ソースマップを無効にする
    }

    if (!config.devServer) {
        config.devServer = {};
    }

    config.devServer.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    };

    return config;
}
