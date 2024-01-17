const express = require('express');
const Product = require('../models/product');

const { isLoggedIn } = require('./helpers');
const { logout } = require('./helpers');

const router = express.Router();

// 조회
router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            const products = await Product.findAll();

            res.render('product', {
                port: process.env.PORT,
                products: products.map(v => v)
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    })

// 물품 생성하기
// localhost:5000/product/create
router.route('/create')
    .get(isLoggedIn, (req, res) => {
        res.render('product')
    })
    .post(isLoggedIn, async (req, res, next) => {
        const {
            name,
            quantity,
            price
        } = req.body;

        try {
            await Product.create({
                name,
                quantity,
                price
            });

            const products = await Product.findAll();

            res.locals.products = products.map(v => v);
            res.locals.name = req.user.name;
            res.redirect('/product');
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

// 상품 수정
router.route('/update/:productId')
    .get(isLoggedIn, (req, res) => {
        res.render('product-modify', {
            productId: req.params.productId,
            port: process.env.PORT
        });
    })
    .post(isLoggedIn, async (req, res, next) => {
        const { name, quantity, price } = req.body;
        const productId = req.params.productId;

        try {
            const result = await Product.update({
                name,
                quantity,
                price
            }, {
                where: { productId }
            });

            if (result) {
                const products = await Product.findAll();

                res.locals.products = products.map(v => v);
                res.locals.name = req.user.name;
                res.locals.port = process.env.PORT;
                res.redirect('/product');
            }
            else next('Not updated!');
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

// 물품 삭제하기
router.get('/delete/:productId', async (req, res, next) => {
    try {
        const result = await Product.destroy({
            where: { productId: req.params.productId }
        });

        if (result) {
            const products = await Product.findAll();

            res.locals.products = products.map(v => v);
            res.locals.name = req.user.name;
            res.locals.port = process.env.PORT;
            res.redirect('/product');
        }
        else next('Not deleted!');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
