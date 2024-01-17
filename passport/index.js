const passport = require('passport');
const local = require('./local');
const kakao = require('./kakao');
const User = require('../models/user');

module.exports = () => {
  /*
      req.session 객체에 어떤 데이터를 저장할 지 선택,
      사용자 정보를 다 들고 있으면 메모리를 많이 차지하기에
      사용자 아이디만 저장
  */
  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  /*
      req.session 에 저장된 사용자 아이디를 바탕으로
      DB 조회로 사용자 정보를 얻어낸 후 req.user 에 저장

      로그인 이후 모든 요청에서 passport.session 미들웨어가
      해당 메서드를 호출하여 라우터에서 객체를 사용 가능하게 함
  */
  passport.deserializeUser((userId, done) => {
    User.findOne({ where: { userId }})
        .then(user => done(null, user))
        .catch(err => done(err));
  });

  local();
  kakao();
};