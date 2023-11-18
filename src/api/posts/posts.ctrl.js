// const Post = require('../../models/post');
// const Post = '../../models/post';
// import Post from '../../models/post';

const { default: mongoose } = require('mongoose');
const Post = require('../../models/post');
const Joi = require('joi');
const sanitizeHtml = require('../../../node_modules/sanitize-html/index');

const { ObjectId } = mongoose.Types;

const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};

exports.getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

exports.checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  console.log(user);
  console.log(post);
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};

// let postId = 1;

// const posts = [
//   {
//     id: 1,
//     title: '제목',
//     body: '내용',
//   },
// ];

// export const write = async (ctx) => {
exports.write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  // 검증하고 나서 검증 실패인 경우 에러처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    // body,
    body: sanitizeHtml(body, sanitizeOption),
    tags,
    user: ctx.state.user,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

const removeHtmlAndShorten = (body) => {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

exports.list = async (ctx) => {
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 }) // 역순정렬
      .limit(10) // 보기갯수 제한
      .skip((page - 1) * 10) // 페이지네이션
      .lean()
      .exec();
    const postCount = await Post.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10)); // 헤더에 마지막 페이지번호 알려주기
    ctx.body = posts
      // .map((post) => post.toJSON()) // lean() 함수를 쓰면 처음부터 JSON형태로 조회
      .map((post) => ({
        ...post,
        // body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
        body: removeHtmlAndShorten(post.body),
      }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

exports.read = async (ctx) => {
  ctx.body = ctx.state.post;
  // const { id } = ctx.params;
  // try {
  //   const post = await Post.findById(id).exec();
  //   if (!post) {
  //     ctx.status = 404;
  //     return;
  //   }
  //   ctx.body = post;
  // } catch (e) {
  //   ctx.throw(500, e);
  // }
};

exports.remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndDelete(id).exec();
    ctx.status = 204; // 성공했지만 응답할 데이터는 없음
  } catch (e) {
    ctx.throw(500, e);
  }
};

// exports.replace = (ctx) => {};

exports.update = async (ctx) => {
  const { id } = ctx.params;
  console.log(ctx.params);
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증 >>> write와 동일하나 required()가 없음
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증하고 나서 검증 실패인 경우 에러처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  // 객체복사
  const nextData = { ...ctx.request.body };
  // body값 필터링
  if (nextData.body) {
    nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
  }

  try {
    // const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
    const post = await Post.findByIdAndUpdate(id, nextData, {
      new: true, // 업데이트된 값을 반환
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

// exports.write = (ctx) => {
//   const { title, body } = ctx.request.body;
//   postId += 1;
//   const post = { id: postId, title, body };
//   posts.push(post);
//   ctx.body = post;
// };

// exports.list = (ctx) => {
//   // export const list = (ctx) => {
//   ctx.body = posts;
// };

// exports.read = (ctx) => {
//   // export const read = (ctx) => {
//   const { id } = ctx.params;
//   const post = posts.find((p) => p.id.toString() === id);

//   if (!post) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   ctx.body = post;
// };

// exports.remove = (ctx) => {
//   // export const remove = (ctx) => {
//   const { id } = ctx.params;
//   const index = posts.findIndex((p) => p.id.toString() === id);
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   posts.splice(index, 1);
//   ctx.status = 204;
// };

// exports.replace = (ctx) => {
//   // export const replace = (ctx) => {
//   const { id } = ctx.params;
//   const index = posts.findIndex((p) => p.id.toString() === id);
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   posts[index] = {
//     id,
//     ...ctx.request.body,
//   };
//   ctx.body = posts[index];
// };

// exports.update = (ctx) => {
//   // export const update = (ctx) => {
//   const { id } = ctx.params;
//   const index = posts.findIndex((p) => p.id.toString() === id);
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   ctx.body = posts[index];
// };
