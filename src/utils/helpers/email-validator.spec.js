jest.mock('validator', () => ({
    isEmailValid: true,

    isEmail(email) {
        this.email = email
        return this.isEmailValid
    }
}))

const validator = require('validator')
const EmailValidator = require('./email-validator')
const MissingParamError = require('../errors/missing-param-error')

const makeSut = () => {
    return new EmailValidator()
}

describe('Email Validator', () => {
    test('It should return true if validator returns true', () => {
        const sut = makeSut()

        const isEmailValid = sut.isValid('valid_email@email.com')

        expect(isEmailValid).toBe(true)
    })

    test('It should return false if validator returns false', () => {
        validator.isEmailValid = false

        const sut = makeSut()

        const isEmailValid = sut.isValid('invalid_email@email.com')

        expect(isEmailValid).toBe(false)
    })

    test('It should call validator with correct email', () => {
        const sut = makeSut()

        sut.isValid('any@email.com')

        expect(validator.email).toBe('any@email.com')
    })

    test('It should throw if no email is provided', async () => {
        const sut = makeSut()

        expect(() => sut.isValid()).toThrow(new MissingParamError('email'))
    })
})
