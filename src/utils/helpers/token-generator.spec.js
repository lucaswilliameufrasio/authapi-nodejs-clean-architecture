jest.mock('jsonwebtoken', () => ({
    token: 'any_token',

    sign(payload, secret) {
        this.payload = payload
        this.secret = secret
        return this.token
    }
}))

const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missing-param-error')
const TokenGenerator = require('./token-generator')

const makeSut = () => {
    return new TokenGenerator('secret')
}

describe('Token Generator', () => {
    test('It should return null if JWT returns null', async () => {
        const sut = makeSut()

        jwt.token = null

        const token = await sut.generate('any_id')

        expect(token).toBeNull()
    })

    test('It should return a token if JWT returns token', async () => {
        const sut = makeSut()

        const token = await sut.generate('any_id')

        expect(token).toBe(jwt.token)
    })

    test('It should call jwt with correct values', async () => {
        const sut = makeSut()

        await sut.generate('any_id')

        expect(jwt.payload).toEqual({ _id: 'any_id' })
        expect(jwt.secret).toBe(sut.secret)
    })

    test('It should throw if no secret is provided', async () => {
        const sut = new TokenGenerator()

        const promise = sut.generate('any_id')

        expect(promise).rejects.toThrow(new MissingParamError('secret'))
    })

    test('It should throw if no id is provided', async () => {
        const sut = makeSut()

        const promise = sut.generate()

        expect(promise).rejects.toThrow(new MissingParamError('id'))
    })
})
