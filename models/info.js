const Sequelize = require('sequelize');

module.exports = class Info extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            infoId: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            address: { //주소
                type: Sequelize.STRING(100),
                allowNull: true
            },
            number: { //전화번호
                type: Sequelize.STRING(100),
                allowNull: true
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Info',
            tableName: 'infos',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Purchase.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' });
    }
};