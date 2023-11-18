// import Router from 'koa-router';
// import posts from './posts';
const Router = require('koa-router');
const posts = require('./posts');
const auth = require('./auth');
const api = new Router();

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());
api.get('/test', (ctx) => {
  ctx.body = 'test 성공';
});

module.exports = api;
// export default api;
