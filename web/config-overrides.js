const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess.withLoaderOptions({
        modifyVars: {
            "@layout-body-background": "#f1f1f1",
            "@layout-header-background": "#FFFFFF",
            "@layout-footer-background": "#f1f1f1"
        },
    })(config, env);
    return config;
};