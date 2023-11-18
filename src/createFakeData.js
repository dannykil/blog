const Post = require('./models/post');
// export default function createFakeData() {
// exports.createFakeData = () => {
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
  Post.insertMany(posts, (err, docs) => {
    console.log(docs);
  });
}
