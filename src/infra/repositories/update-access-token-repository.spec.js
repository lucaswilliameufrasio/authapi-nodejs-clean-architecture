const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
const UpdateAccessTokenRepository = require('./update-access-token-repository')

let db

const makeSut = () => {
    const userModel = db.collection('users')
    const sut = new UpdateAccessTokenRepository(userModel)

    return {
        userModel,
        sut
    }
}

describe('UpdateAccessToken Repository', () => {
    let fakeUserId

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)

        db = await MongoHelper.getDb()
    })

    beforeEach(async () => {
        const userModel = db.collection('users')
        await userModel.deleteMany()

        const fakeUser = await userModel.insertOne({
            email: 'valid_email@mail.com',
            name: 'any_name',
            age: 99,
            state: 'any_state',
            password: 'hashed_password'
        })

        fakeUserId = fakeUser.ops[0]._id
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    test('It should update the user with the given access token', async () => {
        const { sut, userModel } = makeSut()

        sut.update(fakeUserId, 'valid_token')

        const updatedFakeUser = await userModel.findOne({ _id: fakeUserId })

        expect(updatedFakeUser.accessToken).toBe('valid_token')
    })

    test('It should throw if no userModel is provided', async () => {
        const sut = new UpdateAccessTokenRepository()

        const promise = sut.update(fakeUserId, 'valid_token')

        expect(promise).rejects.toThrow()
    })

    test('It should throw if no params are provided', async () => {
        const { sut } = makeSut()

        expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
        expect(sut.update(fakeUserId)).rejects.toThrow(new MissingParamError('accessToken'))
    })
})
