const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

let db

const makeSut = () => {
    return new LoadUserByEmailRepository()
}

describe('LoadUserByEmail Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)

        db = await MongoHelper.getDb()
    })

    beforeEach(async () => {
        await db.collection('users').deleteMany()
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    test('It should return null if no user is found', async () => {
        const sut = makeSut()

        const user = await sut.load('invalid_email@mail.com')

        expect(user).toBeNull()
    })

    test('It should returns an user if user is found', async () => {
        const sut = makeSut()

        const fakeUser = await db.collection('users').insertOne({
            email: 'valid_email@mail.com',
            name: 'any_name',
            age: 99,
            state: 'any_state',
            password: 'hashed_password'
        })

        const user = await sut.load('valid_email@mail.com')

        expect(user).toEqual({
            _id: fakeUser.ops[0]._id,
            password: fakeUser.ops[0].password
        })
    })

    test('It should throw if no email is provided', async () => {
        const sut = makeSut()

        const promise = sut.load()

        expect(promise).rejects.toThrow(new MissingParamError('email'))
    })
})
