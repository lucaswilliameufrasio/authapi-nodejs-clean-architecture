const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-helper')

module.exports = class LoadUserByEmailRepository {

    async load(email) {
        if (!email) {
            throw new MissingParamError('email')
        }

        const db = await MongoHelper.getCollection('users')

        const user = await db.findOne({
            email
        }, {
            projection: {
                password: 1
            }
        })

        return user
    }
}
