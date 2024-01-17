const Sequelize = require('sequelize');

module.exports = class Purchase extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            purchaseId: { // 구매번호
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            name: { //물품이름
                type: Sequelize.STRING(100),
                allowNull: true
            },
            date: { // 날짜
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            quantity: { //수량
                type: Sequelize.BIGINT,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Purchase',
            tableName: 'purchases',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        // Purchase.belongsTo(db.user) => Purchase : User = 1 : N
        // onDelete를 사용하지 않은 이유 => User정보도 같이 삭제되서
        //foreignkey는 source/targetkey를 어떤 이름으로 넘겨줄건지 정하는 것
        db.Purchase.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' });
        db.Purchase.belongsTo(db.Product, { foreignKey: 'productId', targetKey: 'productId' });
    }
};
