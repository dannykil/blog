const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// mongodb에서 데이터를 아래와 같은 구조(스키마)로 가져오도록 구성
const UserSchema = new mongoose.Schema({
  username: String,
  hashedPassword: String,
});

UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    // 첫번째 파라미터에는 토큰 안에 넣고싶은 데이터를 넣는다.
    {
      _id: this.id,
      username: this.username,
    },
    // 두번째 파라미터에느 JWT 암호를 넣는다.
    process.env.JWT_SECRET,
    {
      expiresIn: '3d', // 7일동안 유효함
    },
  );
  return token;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;

// access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTRjNzRlOWY4N2I0Nzk5NzM0ODA2NTIiLCJ1c2VybmFtZSI6InZlbG9wZXJ0IiwiaWF0IjoxNjk5NTE0NjUyLCJleHAiOjE2OTk3NzM4NTJ9.H8YEFbPEoVgMt_1B-tB8gfS9heYFZKLvWYMKQ7eHIRw; path=/; expires=Thu, 16 Nov 2023 07:24:12 GMT; httponly
//
