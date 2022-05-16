const PROXY_CONFIG =  {
  "/api": {
    "target": "https://test-a.itotem.net",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}

module.exports = PROXY_CONFIG;
