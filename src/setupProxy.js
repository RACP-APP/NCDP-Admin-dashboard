const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    // ["/articles/*", "/users/login", "/users/signup", "/users/user"],
    ['/articles/*', '/login/*', '/Dashbord/'],
    proxy({
      target: 'https://localhost:3004',
      changeOrigin: true
    })
  );
};
