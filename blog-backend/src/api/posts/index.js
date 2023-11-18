// import Router from 'koa-router';
// import * as postsCtrl from './posts.ctrl';
const Router = require('koa-router');
const postsCtrl = require('./posts.ctrl');
const checkLoggedIn = require('../../lib/checkLoggedIn');
const posts = new Router();

// const printInfo = (ctx) => {
//   ctx.body = {
//     method: ctx.method,
//     path: ctx.path,
//     params: ctx.params,
//   };
// };

// posts.get('/test', postsCtrl.list);
posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);

const post = new Router();
// posts.get('/:id', postsCtrl.read);
// posts.delete('/:id', postsCtrl.remove);
// // posts.put('/:id', postsCtrl.replace);
// posts.patch('/:id', postsCtrl.update);
post.get('/', postsCtrl.read);
post.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
post.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);
posts.use('/:id', postsCtrl.getPostById, post.routes());

module.exports = posts;
// export default posts;
