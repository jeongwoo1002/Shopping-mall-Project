const express = require('express');
const Product = require('../models/product');
const Purchase = require('../models/purchase');

const { Op } = require('sequelize');
const { isLoggedIn } = require('./helpers');
const { logout } = require('./helpers');


const router = express.Router();

// 조회
router.get('/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const products = await Product.findAll();

        res.render('purchase', {
            port: process.env.PORT,
            name: req.user.name,
            userId: req.params.userId,
            products: products.map(v => v)
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
})

// 구매 내역 가져오기
router.get('/get-payment/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const purchases = await Purchase.findAll({
            where: {userId: req.params.userId}
        });

        res.render('payment-list', {
            port: process.env.PORT,
            name: req.user.name,
            userId: req.params.userId,
            purchases: purchases.map(v => v)
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 물품 구매하기
router.route('/payment/:productId')
    .get(isLoggedIn, async (req, res) => {
        const product = await Product.findOne({
            attributes: ['productId', 'name', 'quantity', 'price'],
            where: { productId: req.params.productId }
        });

        res.render('purchase-payment', {
            product: product,
            port: process.env.PORT
        });
    })
    .post(isLoggedIn, async (req, res, next) => {
        const quantity = req.body.quantity;
        const userId = req.user.userId;
        const productId = req.params.productId;
        const date = new Date();

        const product = await Product.findOne({
            where: { productId: req.params.productId }
        });

        try {
            await Purchase.create({
                userId,
                name: product.name,
                quantity,
                date,
                productId
            });

            product.quantity -= quantity;

            const result = await Product.update({
                quantity: product.quantity
            }, {
                where: { productId }
            })

            if(result) {
                const products = await Product.findAll();

                res.locals.products = products.map(v => v);
                res.locals.name = req.user.name;
                res.locals.prot = process.env.PORT;
                res.locals.userId = userId;
                res.redirect('/purchase');
            }
            else next('Not updated!');

        } catch (err) {
            console.error(err);
            next(err);
        }
    });

// 물품 환불하기
router.get('/refund/:purchaseId', async (req, res, next) => {
    try {
        const purchase = await Purchase.findOne({
            attributes: ['productId', 'quantity'],
            where: { purchaseId: req.params.purchaseId }
        });

        const product = await Product.findOne({
          where: { productId: purchase.productId }
        })

        product.quantity += purchase.quantity;

        const resultProduct = await Product.update({
            quantity: product.quantity
        }, {
            where: { productId: purchase.productId }
        })

        const resultPurchase = await Purchase.destroy({
            where: { purchaseId: req.params.purchaseId }
        });

        if (resultProduct || resultPurchase) {
            const purchases = await Purchase.findAll();

            res.locals.purchases = purchases.map(v => v);
            res.locals.name = req.user.name;
            res.locals.port = process.env.PORT;

            res.render('payment-list');
        }
        else next('Not deleted!');
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;
