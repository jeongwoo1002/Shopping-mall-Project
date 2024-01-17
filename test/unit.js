const assert = require('chai').assert;
const { User } = require('../models/');

describe('Simple Test', () => {
    before(() => {});
    after(() => {});
    beforeEach(() => {});
    afterEach(() => {});
    
    it('3 * 3 = 9', () => {
        assert.equal(3 * 3, 9);
    });
});

describe('ORM Test: [User Model]', () => {
    it('User.findOne(id=kjw4016)', async () => {
        const user = await User.findOne({
            where: { id: 'kjw4016' },
            attributes: ['id', 'name', 'address', 'number']
        });

        assert.equal('kjw4016', user.id);
    });
    
    it('User.findAll()', async () => {
        const users = await User.findAll({
            attributes: ['id', 'name', 'address', 'number']
        });

        assert.exists(users);
    });
});

