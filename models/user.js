const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userId: { // 아이디
                type: Sequelize.STRING(100),
                allowNull: true,
                primaryKey: true
            },
            password: { // 비밀번호
                type: Sequelize.STRING(100),
                allowNull: true
            },
            name: { // 이름
                type: Sequelize.STRING(20),
                allowNull: true
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        // User가 userId를 sourceKey로 제공한다.
        // Purchase는 이 sourceKey를 foreignKey로 가져온다.
        // onDelete는 User정보가 삭제되면(회원 탈퇴 등), 연결된 Purchase 데이터도 같이 삭제 시킨다.
        db.User.hasMany(db.Purchase, { foreignKey: 'userId', sourceKey: 'userId', onDelete: 'cascade' });
        db.User.hasMany(db.Info, { foreignKey: 'userId', sourceKey: 'userId', onDelete: 'cascade' });
    }
};
