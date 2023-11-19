// // 이 파일에서만 no-global-assign ESLint 옵션을 비활성화합니다
// /* eslint-disable no-global-assign */
// // require = require('esm')(module /*, options*/);
// // module.exports = require('./main.js');

// require('dotenv').config();
// const Koa = require('koa');
// const bodyParser = require('koa-bodyparser');
// const Router = require('koa-router');
// const mongoose = require('mongoose');
// const api = require('./api');

// const { PORT, MONGO_URI } = process.env;
// mongoose
//   .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((e) => {
//     console.error(e);
//   });

// const app = new Koa();
// const router = new Router();

// router.use('/api', api.routes());

// app.use(bodyParser());

// app.use(router.routes()).use(router.allowedMethods());

// const port = PORT || 4000;
// app.listen(port, () => {
//   console.log('Listening to port %d', port);
// });

require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const api = require('./api');
const jwt = require('./lib/jwtMiddleware');
const mongoose = require('mongoose');
const Post = require('./models/post');
const jwtMiddleware = require('./lib/jwtMiddleware');
// const createFakeData = require('./createFakeData');
const serve = require('koa-static');
const path = require('path');
const send = require('koa-send');

const { PORT, MONGO_URI } = process.env;
mongoose
  // .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // createFakeData();
  })
  .catch((e) => {
    console.error(e);
  });

function createFakeData() {
  const posts = [...Array(40).keys()].map((i) => ({
    title: `포스트 #${i}`,
    body: `A function that accepts up to three arguments. 
          The map method calls the callbackfn function one time for each element in the array. 
          Calls a defined callback function on each element of an array, and returns an array that contains the results. 
          A function that accepts up to three arguments. 
          The map method calls the callbackfn function one time for each element in the array.
          Calls a defined callback function on each element of an array, and returns an array that contains the results.`,
    tags: ['가짜', '데이터'],
  }));

  // 교재내용
  // Post.insertMany(posts, (err, docs) => {
  //   console.log(docs);
  // });

  // refactored
  Post.insertMany(posts)
    .then(function () {
      console.log('Successfully Inserted!');
    })
    .catch(function (err) {
      console.log(err);
    });
}

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

app.use(bodyParser());

app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

// app.use((ctx) => {
//   ctx.body = 'hello world';
// });

const buildDirectory = path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async (ctx) => {
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    await send(ctx, 'index.html', { root: buildDirectory });
  }
});

const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening to port %d', port);
});

// git push test of backend
