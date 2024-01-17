const Sequelize = require('sequelize');
const User = require('./user');
const Purchase = require('./purchase');
const Product = require('./product');
const Info = require('./info');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

const db = {
    sequelize,
    User,
    Info,
    Purchase,
    Product
};


// 테이블 있는지 확인
// 없으면 생성, 있으면 있구나~ 하고 검사 X
User.init(sequelize);
Info.init(sequelize);
Purchase.init(sequelize);
Product.init(sequelize)

User.associate(db);
Info.associate(db);
Purchase.associate(db);
Product.associate(db);


module.exports = db;
