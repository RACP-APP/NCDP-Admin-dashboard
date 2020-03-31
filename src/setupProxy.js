const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    // ["/articles/*", "/users/login", "/users/signup", "/users/user"],
    ['/Dashbord/*', '/LogIn/*', '/Articles/'],
    proxy({
      target: 'https://localhost:3005',
      changeOrigin: true
    })
  );
};
