jest.mock('bcrypt', () => ({
  isValid: true,

  async compare(value, hash) {
    this.value = value
    this.hash = hash
    return this.isValid
  }
}))

const bcrypt = require('bcrypt')
const MissingParamError = require('../errors/missing-param-error')
const Encrypter = require('./encrypter')

const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  test('It should return true if bcrypt return true', async () => {
    const sut = makeSut()

    const isValid = await sut.compare('any_value', 'hashed_value')

    expect(isValid).toBe(true)
  })

  test('It should return false if bcrypt return false', async () => {
    const sut = makeSut()

    bcrypt.isValid = false

    const isValid = await sut.compare('any_value', 'hashed_value')

    expect(isValid).toBe(false)
  })

  test('It should call bcrypt with correct values', async () => {
    const sut = makeSut()

    await sut.compare('any_value', 'hashed_value')

    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashed_value')
  })

  test('It should throw if no params are provided', async () => {
    const sut = makeSut()

    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
