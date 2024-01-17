const express = require('express');
const Info = require('../models/info');

const { isLoggedIn } = require('./helpers');

// localhost:5000/refrigerator
const router = express.Router();

// 조회
router.get('/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const infos = await Info.findAll({
            where: { userId: req.params.userId }
        });

        res.render('info', {
            infos: infos.map(v => v),
            name: req.user.name,
            port: process.env.PORT,
            userId: req.params.userId
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 회원 상세 정보 추가
router.route('/create/:userId')
    .get(isLoggedIn, (req, res) => {
        res.locals.userId = req.params.userId;
        res.render('info');
    })
    .post(isLoggedIn, async (req, res, next) => {
        const userId = req.params.userId;
        const {
            address,
            number
        } = req.body;

        try {
            await Info.create({
                userId,
                address,
                number
            });

            const infos = await Info.findAll({
                where: { userId }
            });

            res.locals.infos = infos.map(v => v);
            res.locals.name = req.user.name;
            res.locals.port = process.env.PORT;
            res.locals.userId = userId;
            res.redirect(`/info/${userId}`);
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

// 회원 상세 정보 수정
router.route('/update/:infoId')
    .get(isLoggedIn, (req, res) => {
        res.render('info-modify', {
            infoId: req.params.infoId,
            port: process.env.PORT
        });
    })
    .post(isLoggedIn, async (req, res, next) => {
        const { address, number } = req.body;
        const infoId = req.params.infoId;

        try {
            const user = await Info.findOne({
                where: { infoId },
                attributes: ['userId']
            });
            const result = await Info.update({
                address,
                number
            }, {
                where: { infoId }
            });

            if (result) {
                const infos = await Info.findAll({
                    where: { userId: user.userId }
                });

                res.locals.infos = infos.map(v => v);
                res.locals.name = req.user.name;
                res.locals.port = process.env.PORT;
                res.locals.userId = user.userId;
                res.redirect(`/info/${user.userId}`);
            }
            else next('Not deleted!');
        } catch (err) {
            console.error(err);
            next(err);
        }
    });


// 상세 정보 삭제하기
router.get('/delete/:infoId', isLoggedIn, async (req, res, next) => {
    try {
        const user = await Info.findOne({
            where: { infoId: req.params.infoId },
            attributes: ['userId']
        });
        const result = await Info.destroy({
            where: { infoId: req.params.infoId }
        });

        if (result) {
            const infos = await Info.findAll({
                where: { userId: user.userId }
            });

            res.locals.infos = infos.map(v => v);
            res.locals.name = req.user.name;
            res.locals.port = process.env.PORT;
            res.locals.userId = user.userId;
            res.redirect(`/info/${user.userId}`);
        }
        else next('상세 정보가 없습니다.');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;