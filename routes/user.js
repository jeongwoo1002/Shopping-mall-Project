const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/user');

const passport = require('passport');

const { logout } = require('./helpers');
const { isLoggedIn } = require('./helpers');

const router = express.Router();

// 회원가입
// localhost:5000/user/sign-up
// 회원가입 후 기본 화면으로 넘어감
router.route('/sign-up')
    .get((_, res) => {
        res.render('sign-up', {
            port: process.env.PORT
        });
    })
    .post(async (req, res, next) => {
        const { userId, password, name } = req.body;

        const user = await User.findOne({ where: { userId } });
        if (user) return next('이미 등록된 사용자 아이디입니다.');

        try {
            const hash = await bcrypt.hash(password, 12);
            const user = await User.create({
                userId,
                password: hash,
                name
            });

            if (user) res.redirect(`/`);
            else next('회원가입이 되지 않았습니다!');
        } catch (err) {
            console.error(err);
            next(err);
        }
    });


// 로컬 로그인
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (user) req.login(user, loginError => res.redirect('/'));
        else next(info);
    })(req, res, next);
});


// 카카오 로그인
// localhost:5000/user/kakaoLogin
// authenticate에 전달되는 값이 'kakao'이면 -> 카카오 로그인이다.(카카오 전략)
// 카카오 전략을 실행하다라는 의미 => passport/index.js를 호출한 후, kakao()을 호출하여 passport/kakao.js를 호출한다.
router.get('/kakao', passport.authenticate('kakao'));

// localhost:5000/Auth/kakao/callback
router.get('/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
);

// 로그아웃
// localhost:5000/user/logout
// 로그아웃
router.get('/logout', logout)

// 회원 탈퇴
router.get('/delete', async (req, res, next) => {
    try {
        const result = await User.destroy({
            where: { userId: req.user.userId }
        });

        if (result) res.redirect('/');
        else next('Not deleted!');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
