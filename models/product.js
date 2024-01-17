const Sequelize = require('sequelize');

module.exports = class Product extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            productId: { //물품번호
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            name: { //물품이름
                type: Sequelize.STRING(100),
                allowNull: true
            },
            quantity: { //수량
                type: Sequelize.BIGINT,
                allowNull: true
            },
            price: { //가격
                type: Sequelize.STRING(10000),
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Product',
            tableName: 'products',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Product.hasMany(db.Purchase, { foreignKey: 'productId', sourceKey: 'productId', onDelete: 'cascade' });
    }
};
