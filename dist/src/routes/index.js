const newsRouter = require('./news');
const siteRouter = require('./site');
const coursesRouter = require('./courses');
const meRouter = require('./me');

function route(app) {
  app.use('/me', meRouter);
  app.use('/news', newsRouter);
  app.use('/courses', coursesRouter);
  app.use('/', siteRouter);
}
module.exports = route;